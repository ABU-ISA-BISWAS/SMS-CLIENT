import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private BASE = `${environment.baseUrl}${environment.studentManagementApiUrl}`;
  private LOOKUP_BASE = `${environment.baseUrl}${environment.authApiUrl}`;
  private EP = `api/attendance`;
  private REPORT_EP = `api/attendance-report`;

  private SAVE_BULK_URL = `${this.BASE}/${this.EP}/save-bulk`;
  private GET_CLASS_LIST_URL = `${this.BASE}/${this.EP}/class-student-list`;
  private GET_DAY_STATUS_URL = `${this.BASE}/${this.EP}/day-status`;
  private REPORT_URL = `${this.BASE}/${this.EP}/monthly-report`;

  private PRINT_CLASS_URL = `${this.BASE}/${this.REPORT_EP}/print-class-report`;
  private PRINT_STUDENT_URL = `${this.BASE}/${this.REPORT_EP}/print-student-report`;
  private CHECK_HOLIDAY_URL = `${this.BASE}/${this.EP}/check-holiday`;
  private MONTH_HOLIDAYS_URL = `${this.BASE}/${this.EP}/month-holidays`;

  // Dropdown APIs
  private SESSIONS_URL = `${this.LOOKUP_BASE}/api/session/all`;
  private CLASSES_URL = `${this.LOOKUP_BASE}/api/class/all`;
  private SECTIONS_URL = `${this.LOOKUP_BASE}/api/section/all`;
  private SHIFTS_URL = `${this.LOOKUP_BASE}/api/shift/all`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getMonthHolidays(month: number, year: number) {
    const params = new HttpParams().append('month', month).append('year', year);
    return this.http
      .get(this.MONTH_HOLIDAYS_URL, { params })
      .pipe(map((d: any) => d));
  }

  // ── Class student list with today's attendance status ──
  getClassStudentList(
    sessionNo: number,
    classNo: number,
    sectionNo: number | null,
    shiftNo: number | null,
    date: string,
  ) {
    let params = new HttpParams()
      .append('academicSessionNo', sessionNo)
      .append('classMasterNo', classNo)
      .append('attendanceDate', date);
    if (sectionNo) params = params.append('sectionMasterNo', sectionNo);
    if (shiftNo) params = params.append('shiftMasterNo', shiftNo);
    return this.http
      .get(this.GET_CLASS_LIST_URL, { params })
      .pipe(map((d: any) => d));
  }

  // ── Check if attendance already marked for this date ──
  getDayStatus(
    sessionNo: number,
    classNo: number,
    sectionNo: number | null,
    date: string,
  ) {
    let params = new HttpParams()
      .append('academicSessionNo', sessionNo)
      .append('classMasterNo', classNo)
      .append('attendanceDate', date);
    if (sectionNo) params = params.append('sectionMasterNo', sectionNo);
    return this.http
      .get(this.GET_DAY_STATUS_URL, { params })
      .pipe(map((d: any) => d));
  }

  // ── Bulk save ─────────────────────────────────────────
  saveBulkAttendance(data: any) {
    return this.http.post(this.SAVE_BULK_URL, data).pipe(map((d: any) => d));
  }

  checkHoliday(date: string) {
    const params = new HttpParams().append('date', date);
    return this.http
      .get(this.CHECK_HOLIDAY_URL, { params })
      .pipe(map((d: any) => d));
  }

  // ── Monthly report ────────────────────────────────────
  getMonthlyReport(
    sessionNo: number,
    classNo: number,
    sectionNo: number | null,
    shiftNo: number | null,
    month: number,
    year: number,
  ) {
    let params = new HttpParams()
      .append('academicSessionNo', sessionNo)
      .append('classMasterNo', classNo)
      .append('month', month)
      .append('year', year);
    if (sectionNo) params = params.append('sectionMasterNo', sectionNo);
    if (shiftNo) params = params.append('shiftMasterNo', shiftNo);
    return this.http.get(this.REPORT_URL, { params }).pipe(map((d: any) => d));
  }

  // ── Dropdowns ─────────────────────────────────────────
  getAllSessions() {
    return this.http.get(this.SESSIONS_URL).pipe(map((d: any) => d));
  }
  getAllClasses() {
    return this.http.get(this.CLASSES_URL).pipe(map((d: any) => d));
  }
  getAllSections() {
    return this.http.get(this.SECTIONS_URL).pipe(map((d: any) => d));
  }
  getAllShifts() {
    return this.http.get(this.SHIFTS_URL).pipe(map((d: any) => d));
  }

  // Class attendance print — PDF blob return করে
  printClassAttendance(params: any) {
    let httpParams = new HttpParams()
      .append('sessionNo', params.sessionNo)
      .append('classNo', params.classNo)
      .append('fromDate', params.fromDate)
      .append('toDate', params.toDate)
      .append('reportType', params.reportType);

    if (params.sectionNo)
      httpParams = httpParams.append('sectionNo', params.sectionNo);
    if (params.shiftNo)
      httpParams = httpParams.append('shiftNo', params.shiftNo);

    return this.http.get(this.PRINT_CLASS_URL, {
      params: httpParams,
      responseType: 'blob', // ← PDF blob
    });
  }

  // Student attendance print — PDF blob return করে
  printStudentAttendance(params: any) {
    const httpParams = new HttpParams()
      .append('studentNo', params.studentNo)
      .append('fromDate', params.fromDate)
      .append('toDate', params.toDate);

    return this.http.get(this.PRINT_STUDENT_URL, {
      params: httpParams,
      responseType: 'blob', // ← PDF blob
    });
  }
}
