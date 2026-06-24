import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { AttendanceService } from '../_coreStudentMangement/services/attendance.service';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.css'],
  standalone: false,
})
export class AttendanceReportComponent implements OnInit {
  // ── Dropdowns ─────────────────────────────────────────
  sessionList: any[] = [];
  classList: any[] = [];
  sectionList: any[] = [];

  // ── Filter ────────────────────────────────────────────
  selectedSessionNo: number | null = null;
  selectedClassNo: number | null = null;
  selectedSectionNo: number | null = null;
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();

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

  // ── Report Data ───────────────────────────────────────
  reportList: any[] = [];
  calendarDays: number[] = []; // 1..31 of selected month
  calendarData: any = {}; // { studentNo: { day: status } }

  // ── View mode ─────────────────────────────────────────
  viewMode: 'summary' | 'calendar' = 'summary';

  // ── State ─────────────────────────────────────────────
  isLoading = false;
  isLoaded = false;

  // ── Print state ───────────────────────────────────────────────
  isPrintModalOpen = false;
  isPrinting = false;
  printReportType = 'SUMMARY';
  printFromDate: string = '';
  printToDate: string = '';
  shiftList: any[] = [];
  selectedShiftNo: number | null = null;

  constructor(
    private attendanceService: AttendanceService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.generateYears();
    this.loadDropdowns();
  }

  generateYears() {
    const current = new Date().getFullYear();
    for (let y = current; y >= current - 5; y--) {
      this.years.push(y);
    }
  }

  loadDropdowns() {
    forkJoin({
      sessions: this.attendanceService.getAllSessions(),
      classes: this.attendanceService.getAllClasses(),
      sections: this.attendanceService.getAllSections(),
      shifts: this.attendanceService.getAllShifts(),
    }).subscribe({
      next: (res: any) => {
        this.sessionList = res.sessions.items || [];
        this.classList = res.classes.items || [];
        this.sectionList = res.sections.items || [];
        this.shiftList = res.shifts.items || [];
      },
    });
  }

  loadReport() {
    if (!this.selectedSessionNo || !this.selectedClassNo) {
      this.toastr.warning('Please select Session and Class.');
      return;
    }

    this.isLoading = true;
    this.isLoaded = false;
    this.reportList = [];
    this.calendarData = {};

    this.attendanceService
      .getMonthlyReport(
        this.selectedSessionNo,
        this.selectedClassNo,
        this.selectedSectionNo,
        this.selectedShiftNo,
        this.selectedMonth,
        this.selectedYear,
      )
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.success) {
            this.reportList = res.obj?.summary || [];

            // Calendar data build
            const calRaw: any[] = res.obj?.calendar || [];
            this.buildCalendarData(calRaw);

            // Days in selected month
            const daysInMonth = new Date(
              this.selectedYear,
              this.selectedMonth,
              0,
            ).getDate();
            this.calendarDays = Array.from(
              { length: daysInMonth },
              (_, i) => i + 1,
            );

            this.isLoaded = true;
          }
        },
        error: () => {
          this.isLoading = false;
          this.toastr.error('Failed to load report.');
        },
      });
  }

  buildCalendarData(calRaw: any[]) {
    // { studentNo → { day → status } }
    this.calendarData = {};
    calRaw.forEach((row: any) => {
      const sNo = row.studentNo;
      const day = new Date(row.attendanceDate).getDate();
      if (!this.calendarData[sNo]) this.calendarData[sNo] = {};
      this.calendarData[sNo][day] = row.status;
    });
  }

  getDayStatus(studentNo: number, day: number): string {
    return this.calendarData[studentNo]?.[day] || '';
  }

  getDayClass(status: string): string {
    const map: any = {
      P: 'cal-p',
      A: 'cal-a',
      L: 'cal-l',
      E: 'cal-e',
      H: 'cal-h',
    };
    return map[status] || 'cal-empty';
  }

  getDayLabel(status: string): string {
    const map: any = {
      P: 'P',
      A: 'A',
      L: 'L',
      E: 'E',
      H: 'H',
    };
    return map[status] || '';
  }

  getPctClass(pct: number): string {
    if (pct >= 90) return 'pct-high';
    if (pct >= 75) return 'pct-mid';
    return 'pct-low';
  }

  get selectedMonthLabel(): string {
    return this.months.find((m) => m.value === this.selectedMonth)?.label || '';
  }

  // ── Totals ────────────────────────────────────────────
  get totalPresent(): number {
    return this.reportList.reduce((s, r) => s + (r.presentDays || 0), 0);
  }
  get totalAbsent(): number {
    return this.reportList.reduce((s, r) => s + (r.absentDays || 0), 0);
  }
  get avgAttendance(): number {
    if (!this.reportList.length) return 0;
    const sum = this.reportList.reduce((s, r) => s + (r.attendancePct || 0), 0);
    return Math.round(sum / this.reportList.length);
  }

  // ── Open/Close modal ──────────────────────────────────────────
  openPrintModal() {
    // Default: selected month এর first to last date
    const firstDay = new Date(this.selectedYear, this.selectedMonth - 1, 1);
    const lastDay = new Date(this.selectedYear, this.selectedMonth, 0);
    this.printFromDate = firstDay.toISOString().split('T')[0];
    this.printToDate = lastDay.toISOString().split('T')[0];
    this.isPrintModalOpen = true;
  }

  closePrintModal() {
    this.isPrintModalOpen = false;
    this.isPrinting = false;
  }

  // ── Print class report ────────────────────────────────────────
  printClassReport() {
    if (!this.selectedSessionNo || !this.selectedClassNo) {
      this.toastr.warning('Please select Session and Class first.');
      return;
    }
    if (!this.printFromDate || !this.printToDate) {
      this.toastr.warning('Please select date range.');
      return;
    }

    this.isPrinting = true;

    const params = {
      sessionNo: this.selectedSessionNo,
      classNo: this.selectedClassNo,
      sectionNo: this.selectedSectionNo || '',
      shiftNo: this.selectedShiftNo || '',
      fromDate: this.printFromDate,
      toDate: this.printToDate,
      reportType: this.printReportType,
      companyNo: '', // backend থেকে session নেবে
    };

    this.attendanceService.printClassAttendance(params).subscribe({
      next: (blob: Blob) => {
        this.isPrinting = false;
        this.closePrintModal();
        this.openPdfInNewTab(blob);
      },
      error: () => {
        this.isPrinting = false;
        this.toastr.error('Failed to generate report.');
      },
    });
  }

  // ── Open PDF blob in new tab ──────────────────────────────────
  openPdfInNewTab(blob: Blob) {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  // ── Helper labels ─────────────────────────────────────────────
  getSelectedClassName(): string {
    return (
      this.classList.find((c) => c.id === this.selectedClassNo)?.className || ''
    );
  }

  getSelectedSectionName(): string {
    return (
      this.sectionList.find((s) => s.id === this.selectedSectionNo)
        ?.sectionName || ''
    );
  }

  getSelectedShiftName(): string {
    return (
      this.shiftList.find((s) => s.id === this.selectedShiftNo)?.shiftName || ''
    );
  }
}
