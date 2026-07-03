import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { AdmissionService } from '../../_coreStudentMangement/services/admission.service';

@Component({
  selector: 'app-admission-profile',
  templateUrl: './admission-profile.component.html',
  styleUrls: ['./admission-profile.component.css'],
  standalone: false,
})
export class AdmissionProfileComponent implements OnInit {
  bsModalRef!: BsModalRef;

  admissionNo!: number;
  profileData!: any;
  photoPreview!: any;
  admissionData!: any;
  documentList: any[] = [];

  isLoading = true;
  isStatusUpdating = false;
  isDocumentsLoading = false;

  activeTab: 'info' | 'documents' | 'attendance' = 'info';

  // Calendar state
  calendarMonth: number = new Date().getMonth() + 1;
  calendarYear: number = new Date().getFullYear();
  calendarData: any[] = [];
  calendarDays: number[] = [];
  isCalendarLoading = false;

  months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  years: number[] = [];

  statusOptions = [
    { value: 'ACTIVE', label: 'Active', cls: 'status-active' },
    { value: 'TC_ISSUED', label: 'TC Issued', cls: 'status-tc' },
    { value: 'PASSED_OUT', label: 'Passed Out', cls: 'status-passed' },
    { value: 'DROPOUT', label: 'Dropout', cls: 'status-dropout' },
    { value: 'EXPELLED', label: 'Expelled', cls: 'status-exp' },
  ];

  admissionTypeLabels: any = {
    NEW: 'New Admission',
    TRANSFER: 'Transfer',
    RE_ADMISSION: 'Re-Admission',
  };

  photoBase64: SafeResourceUrl | null = null;

  previewImageUrl: SafeResourceUrl | null = null;
  previewImageName = '';

  // ── Print state ───────────────────────────────────────────────
  isStudentPrintModalOpen = false;
  isStudentPrinting = false;
  studentPrintType = 'MONTHLY'; // MONTHLY / YEARLY / DATE_RANGE
  studentPrintFromDate = '';
  studentPrintToDate = '';

  monthHolidays: Map<string, string> = new Map();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private admissionService: AdmissionService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.admissionNo = Number(this.route.snapshot.paramMap.get('id'));
    this.profileData = history.state.studentData;
    this.admissionData = history.state.admissionData;

    if (
      !this.profileData ||
      !this.admissionData.student.studentNo ||
      !this.profileData?.admissionNo
    ) {
      console.error('Profile/Admission data missing — cannot load documents', {
        profileData: this.profileData,
        admissionData: this.admissionData,
      });
      this.toastr.error(
        'Profile/Admission data missing — cannot load documents',
      );
      this.isLoading = false;
      return;
    }

    this.loadPhoto();
  }

  generateYears() {
    const current = new Date().getFullYear();
    for (let y = current; y >= current - 5; y--) {
      this.years.push(y);
    }
  }

  loadPhoto() {
    this.isLoading = true;
    if (this.admissionNo) {
      this.admissionService.getSingle(this.admissionNo).subscribe({
        next: (res: any) => {
          if (res && res.obj) {
            this.isLoading = false;
            let studentNo = res.obj.student.studentNo;
            let admissionNo = res.obj.admission.admissionNo;
            if (studentNo && admissionNo) {
              this.findStudentPhoto(studentNo);
              this.loadDocuments(studentNo, admissionNo);
              this.generateYears();
            }
          }
        },
        error: () => {
          this.isLoading = false;
          this.toastr.error('Failed to load admission data.');
        },
      });
    }
  }

  findStudentPhoto(studentNo: any) {
    this.admissionService.findStudentPhoto(studentNo).subscribe(
      (res) => {
        if (res.success) {
          this.photoPreview =
            res.obj != null
              ? this.sanitizer.bypassSecurityTrustResourceUrl(
                  'data:image/*;base64,' + res.obj,
                )
              : null;
        }
      },
      (err) => {
        console.log(' Error ', err);
      },
    );
  }

  // ── Load Documents (metadata + BLOB) ─────────────────
  loadDocuments(studentNo: number, admissionNo: number) {
    this.isDocumentsLoading = true;
    this.documentList = [];

    this.admissionService.getDocuments(studentNo).subscribe({
      next: (res: any) => {
        const docList: any[] = res?.items || [];

        if (docList.length === 0) {
          this.isDocumentsLoading = false;
          return;
        }

        const enrichedList: any[] = [];

        docList.forEach((doc: any) => {
          const mimeType = this.getMimeType(doc.fileType);

          enrichedList.push({
            ...doc,
            mimeType,
            base64: doc?.documentBase64 || null,
            dataUrl: doc?.documentBase64
              ? this.sanitizer.bypassSecurityTrustResourceUrl(
                  `data:${mimeType};base64,${doc.documentBase64}`,
                )
              : null,
          });
        });
        this.documentList = enrichedList;
        this.isDocumentsLoading = false;
      },
      error: () => {
        this.isDocumentsLoading = false;
        this.toastr.error('Failed to load documents.');
      },
    });
  }

  // ── Attendance calendar load ───────────────────────────────────
  // loadAttendanceCalendar() {
  //   const studentNo = this.admissionData.student.studentNo;
  //   if (!studentNo) return;

  //   this.isCalendarLoading = true;
  //   this.calendarData = [];

  //   // Days in selected month
  //   const daysInMonth = new Date(
  //     this.calendarYear,
  //     this.calendarMonth,
  //     0,
  //   ).getDate();
  //   this.calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  //   this.admissionService
  //     .getStudentMonthly(studentNo, this.calendarMonth, this.calendarYear)
  //     .subscribe({
  //       next: (res: any) => {
  //         this.isCalendarLoading = false;
  //         this.calendarData = res?.obj || [];
  //       },
  //       error: () => {
  //         this.isCalendarLoading = false;
  //       },
  //     });
  // }

  loadAttendanceCalendar() {
    const studentNo = this.admissionData.student.studentNo;
    if (!studentNo) return;

    this.isCalendarLoading = true;
    this.calendarData = [];
    this.monthHolidays.clear();

    const daysInMonth = new Date(
      this.calendarYear,
      this.calendarMonth,
      0,
    ).getDate();
    this.calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Student attendance + holidays একসাথে load
    forkJoin({
      attendance: this.admissionService.getStudentMonthly(
        studentNo,
        this.calendarMonth,
        this.calendarYear,
      ),
      holidays: this.admissionService.getMonthHolidays(
        this.calendarMonth,
        this.calendarYear,
      ),
    }).subscribe({
      next: (res: any) => {
        this.isCalendarLoading = false;

        // Holiday map
        const holidayList: any[] = res.holidays?.obj || [];
        holidayList.forEach((h: any) => {
          this.monthHolidays.set(h.holidayDate, h.holidayName);
        });

        // Attendance data
        this.calendarData = res.attendance?.obj || [];
      },
      error: () => {
        this.isCalendarLoading = false;
      },
    });
  }

  getStatusForDay(day: number): string {
    const dateStr =
      `${this.calendarYear}-` +
      String(this.calendarMonth).padStart(2, '0') +
      '-' +
      String(day).padStart(2, '0');

    // Priority 1: Attendance record আছে?
    const found = this.calendarData.find(
      (d: any) => d.attendanceDate === dateStr,
    );
    if (found?.status) return found.status;

    // Priority 2 & 3: Holiday setup থেকে
    if (this.monthHolidays.has(dateStr)) return 'H';

    // Priority 4: Future date?
    const cellDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (cellDate > today) return 'FUTURE';

    return '';
  }

  // ── Tab switch এ attendance load ───────────────────────────────
  onTabChange(tab: 'info' | 'documents' | 'attendance') {
    this.activeTab = tab;
    if (tab === 'attendance' && this.calendarData.length === 0) {
      this.loadAttendanceCalendar();
    }
  }

  // ── Calendar helpers ───────────────────────────────────────────
  // getStatusForDay(day: number): string {
  //   const dateStr =
  //     `${this.calendarYear}-` +
  //     String(this.calendarMonth).padStart(2, '0') +
  //     '-' +
  //     String(day).padStart(2, '0');

  //   const found = this.calendarData.find(
  //     (d: any) => d.attendanceDate === dateStr,
  //   );
  //   return found?.status || '';
  // }

  // getDayClass(status: string): string {
  //   const map: any = {
  //     P: 'cal-day--present',
  //     A: 'cal-day--absent',
  //     L: 'cal-day--late',
  //     E: 'cal-day--excused',
  //     H: 'cal-day--holiday',
  //   };
  //   return map[status] || 'cal-day--empty';
  // }

  getDayClass(status: string): string {
    const map: any = {
      P: 'cal-day--present',
      A: 'cal-day--absent',
      L: 'cal-day--late',
      E: 'cal-day--excused',
      H: 'cal-day--holiday',
      FUTURE: 'cal-day--future',
    };
    return map[status] || 'cal-day--empty';
  }
  // getDayLabel(status: string): string {
  //   const map: any = {
  //     P: 'Present',
  //     A: 'Absent',
  //     L: 'Late',
  //     E: 'Excused',
  //     H: 'Holiday',
  //   };
  //   return map[status] || 'Not marked';
  // }

  getDayLabel(day: number): string {
    const dateStr =
      `${this.calendarYear}-` +
      String(this.calendarMonth).padStart(2, '0') +
      '-' +
      String(day).padStart(2, '0');

    const status = this.getStatusForDay(day);

    if (status === 'H') {
      return this.monthHolidays.get(dateStr) || 'Holiday';
    }

    const labels: any = {
      P: 'Present',
      A: 'Absent',
      L: 'Late',
      E: 'Excused',
      FUTURE: 'Upcoming',
    };
    return labels[status] || 'Not Marked';
  }

  // ── isHolidayDay() helper ─────────────────────────────
  isHolidayDay(day: number): boolean {
    const dateStr =
      `${this.calendarYear}-` +
      String(this.calendarMonth).padStart(2, '0') +
      '-' +
      String(day).padStart(2, '0');
    return this.monthHolidays.has(dateStr);
  }

  // ── presentCount, absentCount শুধু working days count ─
  get presentCount(): number {
    // Attendance record এ P আছে
    return this.calendarData.filter((d: any) => d.status === 'P').length;
  }

  get absentCount(): number {
    return this.calendarData.filter((d: any) => d.status === 'A').length;
  }

  get lateCount(): number {
    return this.calendarData.filter((d: any) => d.status === 'L').length;
  }

  get selectedMonthLabel(): string {
    return this.months.find((m) => m.value === this.calendarMonth)?.label || '';
  }

  // ── Attendance summary counts ──────────────────────────────────
  // get presentCount(): number {
  //   return this.calendarData.filter((d: any) => d.status === 'P').length;
  // }
  // get absentCount(): number {
  //   return this.calendarData.filter((d: any) => d.status === 'A').length;
  // }
  // get lateCount(): number {
  //   return this.calendarData.filter((d: any) => d.status === 'L').length;
  // }

  get holidayCount(): number {
    // Attendance record এ H + Holiday map থেকে auto H
    const markedH = this.calendarData.filter(
      (d: any) => d.status === 'H',
    ).length;

    // Auto holiday (not manually marked)
    let autoH = 0;
    this.calendarDays.forEach((day) => {
      const dateStr =
        `${this.calendarYear}-` +
        String(this.calendarMonth).padStart(2, '0') +
        '-' +
        String(day).padStart(2, '0');
      const hasRecord = this.calendarData.find(
        (d: any) => d.attendanceDate === dateStr,
      );
      if (!hasRecord && this.monthHolidays.has(dateStr)) {
        autoH++;
      }
    });

    return markedH + autoH;
  }

  get attendancePct(): number {
    const totalMarked = this.calendarData.filter(
      (d: any) => d.status !== 'H',
    ).length;
    if (totalMarked === 0) return 0;
    const present = this.calendarData.filter(
      (d: any) => d.status === 'P' || d.status === 'L',
    ).length;
    return Math.round((present / totalMarked) * 100);
  }

  // get attendancePct(): number {
  //   const total = this.calendarData.filter((d: any) => d.status !== 'H').length;
  //   if (total === 0) return 0;
  //   const present = this.calendarData.filter(
  //     (d: any) => d.status === 'P' || d.status === 'L',
  //   ).length;
  //   return Math.round((present / total) * 100);
  // }

  getStartEmptyCells(): number[] {
    // Month এর প্রথম দিন কোন weekday (0=Sun, 6=Sat)
    const firstDay = new Date(
      this.calendarYear,
      this.calendarMonth - 1,
      1,
    ).getDay();
    return Array(firstDay).fill(0);
  }

  // ── View Image (lightbox) ─────────────────────────────
  viewImage(dataUrl: SafeResourceUrl, fileName: string) {
    this.previewImageUrl = dataUrl;
    this.previewImageName = fileName;
  }

  closePreview() {
    this.previewImageUrl = null;
    this.previewImageName = '';
  }

  // ── View PDF (new tab) ────────────────────────────────
  viewPdf(base64: string, fileName: string) {
    const byteChars = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteChars.length; offset += 512) {
      const slice = byteChars.slice(offset, offset + 512);
      const byteNums = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNums[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNums));
    }
    const blob = new Blob(byteArrays, { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  }

  getStatusClass(status: string): string {
    const map: any = {
      ACTIVE: 'status-active',
      TC_ISSUED: 'status-tc',
      PASSED_OUT: 'status-passed',
      DROPOUT: 'status-dropout',
      EXPELLED: 'status-exp',
    };
    return map[status] || 'status-active';
  }

  getStatusLabel(status: string): string {
    const map: any = {
      ACTIVE: 'Active',
      TC_ISSUED: 'TC Issued',
      PASSED_OUT: 'Passed Out',
      DROPOUT: 'Dropout',
      EXPELLED: 'Expelled',
    };
    return map[status] || status;
  }

  changeStatus(newStatus: string) {
    const currentStatus = this.admissionData?.admissionStatus;
    if (newStatus === currentStatus) return;

    if (newStatus === 'TC_ISSUED') {
      this.openTcModal(newStatus);
      return;
    }

    const initialState = {
      title: `Change status to "${this.getStatusLabel(newStatus)}"?`,
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: '',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.callUpdateStatus(newStatus, null, null);
      }
    });
  }

  openTcModal(status: string) {
    const tcDate = window.prompt(
      'Enter TC Date (YYYY-MM-DD):',
      new Date().toISOString().split('T')[0],
    );
    if (!tcDate) return;

    const tcReason = window.prompt('Enter TC Reason:') || '';
    this.callUpdateStatus(status, tcDate, tcReason);
  }

  callUpdateStatus(
    status: string,
    tcDate: string | null,
    tcReason: string | null,
  ) {
    this.isStatusUpdating = true;
    const payload = {
      admissionNo: this.admissionNo,
      admissionStatus: status,
      tcDate: tcDate || '',
      tcReason: tcReason || '',
    };
    this.admissionService.updateStatus(payload).subscribe({
      next: (res: any) => {
        this.isStatusUpdating = false;
        if (res.success) {
          this.toastr.success(res.message || 'Status updated!');
        } else {
          this.toastr.warning(res.message || 'Failed to update status.');
        }
      },
      error: () => {
        this.isStatusUpdating = false;
        this.toastr.error('Something went wrong.');
      },
    });
  }

  // ── Download (Base64 → file) ──────────────────────────
  downloadDocument(doc: any) {
    if (!doc.base64) {
      this.toastr.warning('File not available for download.');
      return;
    }

    const byteChars = atob(doc.base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteChars.length; offset += 512) {
      const slice = byteChars.slice(offset, offset + 512);
      const byteNums = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNums[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNums));
    }

    const blob = new Blob(byteArrays, { type: doc.mimeType });
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = doc.fileName;
    a.click();

    // Memory cleanup
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  }

  get initials(): string {
    const name = this.admissionData.student?.fullName || '';
    return name
      .split(' ')
      .slice(0, 2)
      .map((w: string) => w.charAt(0).toUpperCase())
      .join('');
  }

  closeForm() {
    this.router.navigate(['student-management/admission/admission-list']);
  }

  // ── Helpers ───────────────────────────────────────────
  getMimeType(fileType: string): string {
    switch ((fileType || '').toUpperCase()) {
      case 'PDF':
        return 'application/pdf';
      case 'JPG':
      case 'JPEG':
        return 'image/jpeg';
      case 'PNG':
        return 'image/png';
      default:
        return 'application/octet-stream';
    }
  }

  goBack() {
    this.router.navigate(['/student/admission']);
  }

  openStudentPrintModal() {
    // Default: current month
    const firstDay = new Date(this.calendarYear, this.calendarMonth - 1, 1);
    const lastDay = new Date(this.calendarYear, this.calendarMonth, 0);
    this.studentPrintFromDate = firstDay.toISOString().split('T')[0];
    this.studentPrintToDate = lastDay.toISOString().split('T')[0];
    this.isStudentPrintModalOpen = true;
  }

  closeStudentPrintModal() {
    this.isStudentPrintModalOpen = false;
    this.isStudentPrinting = false;
  }

  onStudentPrintTypeChange() {
    const now = new Date();
    if (this.studentPrintType === 'MONTHLY') {
      const first = new Date(this.calendarYear, this.calendarMonth - 1, 1);
      const last = new Date(this.calendarYear, this.calendarMonth, 0);
      this.studentPrintFromDate = first.toISOString().split('T')[0];
      this.studentPrintToDate = last.toISOString().split('T')[0];
    } else if (this.studentPrintType === 'YEARLY') {
      this.studentPrintFromDate = `${this.calendarYear}-01-01`;
      this.studentPrintToDate = `${this.calendarYear}-12-31`;
    }
    // DATE_RANGE → user manually set করবে
  }

  printStudentReport() {
    const studentNo = this.admissionData.student.studentNo;
    if (!studentNo) return;

    if (!this.studentPrintFromDate || !this.studentPrintToDate) {
      this.toastr.warning('Please select date range.');
      return;
    }

    this.isStudentPrinting = true;

    const params = {
      studentNo: studentNo,
      fromDate: this.studentPrintFromDate,
      toDate: this.studentPrintToDate,
    };

    this.admissionService.printStudentAttendance(params).subscribe({
      next: (blob: Blob) => {
        this.isStudentPrinting = false;
        this.closeStudentPrintModal();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      },
      error: () => {
        this.isStudentPrinting = false;
        this.toastr.error('Failed to generate report.');
      },
    });
  }

  printIdCard() {
    const studentNo = this.admissionData.student.studentNo;
    if (!studentNo) return;

    this.admissionService.printIdCard(studentNo).subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      },
      error: () => this.toastr.error('Failed to generate ID Card.'),
    });
  }
}
