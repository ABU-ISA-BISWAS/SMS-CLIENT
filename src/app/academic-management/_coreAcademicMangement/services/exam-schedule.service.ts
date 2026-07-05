import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExamScheduleService {
  private BASE = `${environment.baseUrl}${environment.authApiUrl}`;
  private BASE_AM = `${environment.baseUrl}${environment.academicManagementApiUrl}`;
  private EP = 'api/exam-schedule';

  // Dropdown URLs
  private SESSIONS_URL = `${this.BASE}/api/session/all`;
  private CLASSES_URL = `${this.BASE}/api/class/all`;
  private EXAM_TYPES_URL = `${this.BASE}/api/lookup/exam-type/all`;
  private SUBJECTS_URL = `${this.BASE}/api/subject/all`;
  private ROOMS_URL = `${this.BASE}/api/room/all`;

  private GRID_URL = `${this.BASE_AM}/${this.EP}/gridList`;
  private SAVE_URL = `${this.BASE_AM}/${this.EP}/create`;
  private UPDATE_URL = `${this.BASE_AM}/${this.EP}/update`;
  private FIND_URL = `${this.BASE_AM}/${this.EP}/find`;
  private DELETE_URL = `${this.BASE_AM}/${this.EP}/delete`;
  private STATUS_URL = `${this.BASE_AM}/${this.EP}/update-status`;
  private ROUTINE_URL = `${this.BASE_AM}/${this.EP}/save-routine`;
  private ROUTINE_LIST_URL = `${this.BASE_AM}/${this.EP}/routine-list`;
  private SUBJECTS_BY_CLASS_URL = `${this.BASE_AM}/api/exam-schedule/subject/by-class`;

  constructor(private http: HttpClient) {}

  // ── Dropdowns ─────────────────────────────────────────
  getAllSessions() {
    return this.http.get(this.SESSIONS_URL).pipe(map((d: any) => d));
  }
  getAllClasses() {
    return this.http.get(this.CLASSES_URL).pipe(map((d: any) => d));
  }
  getAllExamTypes() {
    return this.http.get(this.EXAM_TYPES_URL).pipe(map((d: any) => d));
  }
  getAllRooms() {
    return this.http.get(this.ROOMS_URL).pipe(map((d: any) => d));
  }

  getSubjectsByClass(classNo: number) {
    const params = new HttpParams().append('classNo', classNo);
    return this.http
      .get(this.SUBJECTS_BY_CLASS_URL, { params })
      .pipe(map((d: any) => d));
  }

  // ── CRUD ──────────────────────────────────────────────
  gridList(request: any) {
    return this.http
      .get(this.GRID_URL, { params: request })
      .pipe(map((d: any) => d));
  }
  save(data: any) {
    return this.http.post(this.SAVE_URL, data).pipe(map((d: any) => d));
  }
  update(data: any) {
    return this.http.put(this.UPDATE_URL, data).pipe(map((d: any) => d));
  }
  find(id: number) {
    const params = new HttpParams().append('id', id);
    return this.http.get(this.FIND_URL, { params }).pipe(map((d: any) => d));
  }
  delete(id: number) {
    const params = new HttpParams().append('id', id);
    return this.http
      .delete(this.DELETE_URL, { params })
      .pipe(map((d: any) => d));
  }
  updateStatus(data: any) {
    return this.http.put(this.STATUS_URL, data).pipe(map((d: any) => d));
  }

  // ── Routine ───────────────────────────────────────────
  saveRoutine(data: any) {
    return this.http.post(this.ROUTINE_URL, data).pipe(map((d: any) => d));
  }
  getRoutineList(examScheduleNo: number) {
    const params = new HttpParams().append('examScheduleNo', examScheduleNo);
    return this.http
      .get(this.ROUTINE_LIST_URL, { params })
      .pipe(map((d: any) => d));
  }
}
