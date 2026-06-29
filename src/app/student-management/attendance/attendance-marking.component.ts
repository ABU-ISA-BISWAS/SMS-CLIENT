import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AttendanceEntry } from '../_coreStudentMangement/models/attendance.model';
import { AdmissionService } from '../_coreStudentMangement/services/admission.service';
import { AttendanceService } from '../_coreStudentMangement/services/attendance.service';

@Component({
  selector: 'app-attendance-marking',
  templateUrl: './attendance-marking.component.html',
  styleUrls: ['./attendance-marking.component.css'],
  standalone: false,
})
export class AttendanceMarkingComponent implements OnInit {
  // ── Dropdowns ─────────────────────────────────────────
  sessionList: any[] = [];
  classList: any[] = [];
  sectionList: any[] = [];
  shiftList: any[] = [];

  // ── Filter values ─────────────────────────────────────
  selectedSessionNo: number | null = null;
  selectedClassNo: number | null = null;
  selectedSectionNo: number | null = null;
  selectedShiftNo: number | null = null;
  selectedDate: string = this.getTodayDate();

  // ── Student attendance list ───────────────────────────
  attendanceList: AttendanceEntry[] = [];

  // ── State ─────────────────────────────────────────────
  isLoading = false;
  isSaving = false;
  isLoaded = false;
  isAlreadyMarked = false;

  // Select all
  selectAllStatus: string = 'P';

  statusOptions = [
    { value: 'P', label: 'Present', cls: 'status-p' },
    { value: 'A', label: 'Absent', cls: 'status-a' },
    { value: 'L', label: 'Late', cls: 'status-l' },
    { value: 'E', label: 'Excused', cls: 'status-e' },
  ];

  holidayInfo: {
    isHoliday: boolean;
    holidayType: string;
    holidayName: string;
  } = { isHoliday: false, holidayType: 'NONE', holidayName: '' };

  isHolidayChecking = false;

  constructor(
    private attendanceService: AttendanceService,
    private toastr: ToastrService,
    private admissionService: AdmissionService,
  ) {}

  ngOnInit() {
    this.loadDropdowns();
    this.checkHoliday();
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

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // ── Load students for marking ─────────────────────────
  loadStudents() {
    if (!this.selectedSessionNo || !this.selectedClassNo) {
      this.toastr.warning('Please select Session and Class.');
      return;
    }

    this.isLoading = true;
    this.isLoaded = false;
    this.attendanceList = [];

    this.attendanceService
      .getClassStudentList(
        this.selectedSessionNo,
        this.selectedClassNo,
        this.selectedSectionNo,
        this.selectedShiftNo,
        this.selectedDate,
      )
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.success) {
            this.attendanceList = (res.obj || []).map((s: any) => ({
              studentNo: s.studentNo,
              admissionNo: s.admissionNo,
              studentCode: s.studentCode,
              fullName: s.fullName,
              fullNameBn: s.fullNameBn,
              rollNo: s.rollNo,
              status: s.status
                ? s.status
                : this.holidayInfo.isHoliday
                  ? 'H'
                  : 'P',
              remarks: s.remarks || '',
            }));
            this.isAlreadyMarked = res.obj?.some((s: any) => s.status);
            this.isLoaded = true;
          }
        },
        error: () => {
          this.isLoading = false;
          this.toastr.error('Failed to load student list.');
        },
      });
  }

  // ── Mark all as same status ───────────────────────────
  markAll(status: string) {
    this.attendanceList.forEach((s) => (s.status = status));
  }

  // ── Single student status toggle ──────────────────────
  setStatus(entry: AttendanceEntry, status: string) {
    entry.status = status;
  }

  // ── Count by status ───────────────────────────────────
  countByStatus(status: string): number {
    return this.attendanceList.filter((s) => s.status === status).length;
  }

  get totalStudents(): number {
    return this.attendanceList.length;
  }

  // ── Save attendance ───────────────────────────────────
  saveAttendance() {
    if (!this.isLoaded || this.attendanceList.length === 0) {
      this.toastr.warning('No students loaded.');
      return;
    }

    this.isSaving = true;
    const payload = {
      attendanceDate: this.selectedDate,
      academicSessionNo: this.selectedSessionNo,
      classMasterNo: this.selectedClassNo,
      sectionMasterNo: this.selectedSectionNo,
      shiftMasterNo: this.selectedShiftNo,
      attendanceList: this.attendanceList.map((s) => ({
        studentNo: s.studentNo,
        admissionNo: s.admissionNo,
        status: s.status,
        remarks: s.remarks,
      })),
    };

    this.attendanceService
      .saveBulkAttendance(payload)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.toastr.success(res.message || 'Attendance saved!');
            this.isAlreadyMarked = true;
          } else {
            this.toastr.warning(res.message || 'Save failed.');
          }
        },
        error: () => this.toastr.error('Something went wrong.'),
      });
  }

  // onDateChange() {
  //   // Date বদলালে reload করুন
  //   if (this.isLoaded) this.loadStudents();
  // }

  onDateChange() {
    this.holidayInfo = {
      isHoliday: false,
      holidayType: 'NONE',
      holidayName: '',
    };
    this.attendanceList = [];
    this.isLoaded = false;

    if (this.selectedDate) {
      this.checkHoliday();
    }
  }

  // ── Holiday check ─────────────────────────────────────
  checkHoliday() {
    this.isHolidayChecking = true;
    this.attendanceService.checkHoliday(this.selectedDate).subscribe({
      next: (res: any) => {
        this.isHolidayChecking = false;
        if (res.success && res.obj) {
          this.holidayInfo = {
            isHoliday: res.obj.isHoliday === 1,
            holidayType: res.obj.holidayType || 'NONE',
            holidayName: res.obj.holidayName || '',
          };
        }
      },
      error: () => {
        this.isHolidayChecking = false;
      },
    });
  }
}
