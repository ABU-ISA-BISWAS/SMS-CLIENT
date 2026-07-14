import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClassRoutineService {
  private BASE = `${environment.baseUrl}${environment.authApiUrl}`;
  private BASE_AM = `${environment.baseUrl}${environment.academicManagementApiUrl}`;

  private SESSIONS_URL = `${this.BASE}/api/session/all`;
  private CLASSES_URL = `${this.BASE}/api/class/all`;
  private SECTIONS_URL = `${this.BASE}/api/section/all`;
  private SHIFTS_URL = `${this.BASE}/api/shift/all`;
  private SUBJECTS_URL = `${this.BASE}/api/class-subject-mapping/list-by-class`;
  private EMPLOYEES_URL = `${this.BASE}/api/employee/list`;
  private ROOMS_URL = `${this.BASE}/api/room/all`;

  private PERIODS_URL = `${this.BASE}/api/period-master/list-by-shift`;

  private ROUTINE_GET_URL = `${this.BASE_AM}/api/class-routine/get`;
  private ROUTINE_SAVE_URL = `${this.BASE_AM}/api/class-routine/save`;
  private PRINT_URL = `${this.BASE_AM}/api/class-routine/print`;
  private DELETE_URL = `${this.BASE_AM}/api/class-routine/delete`;

  constructor(private http: HttpClient) {}

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
  getAllRooms() {
    return this.http.get(this.ROOMS_URL).pipe(map((d: any) => d));
  }

  getSubjectsByClass(classNo: number) {
    const body = {
      classMasterNo: classNo,
    };

    return this.http.post(this.SUBJECTS_URL, body).pipe(map((d: any) => d));
  }

  getTeachers() {
    return this.http.get(this.EMPLOYEES_URL).pipe(map((d: any) => d));
  }

  getPeriods(shiftNo?: number | null) {
    let params = new HttpParams();

    if (shiftNo !== null && shiftNo !== undefined) {
      params = params.append('shiftNo', shiftNo.toString());
    }

    return this.http.get(this.PERIODS_URL, { params });
  }

  getRoutine(filter: any) {
    let params = new HttpParams()
      .append('sessionNo', filter.academicSessionNo)
      .append('classNo', filter.classMasterNo);
    if (filter.sectionMasterNo)
      params = params.append('sectionNo', filter.sectionMasterNo);
    if (filter.shiftMasterNo)
      params = params.append('shiftNo', filter.shiftMasterNo);
    return this.http
      .get(this.ROUTINE_GET_URL, { params })
      .pipe(map((d: any) => d));
  }

  saveRoutine(data: any) {
    return this.http.post(this.ROUTINE_SAVE_URL, data).pipe(map((d: any) => d));
  }

  printRoutine(filter: any) {
    let params = new HttpParams()
      .append('sessionNo', filter.academicSessionNo)
      .append('classNo', filter.classMasterNo);
    if (filter.sectionMasterNo)
      params = params.append('sectionNo', filter.sectionMasterNo);
    if (filter.shiftMasterNo)
      params = params.append('shiftNo', filter.shiftMasterNo);
    return this.http.get(this.PRINT_URL, {
      params,
      responseType: 'blob',
    });
  }

  delete(id: number) {
    const params = new HttpParams().append('id', id);
    return this.http
      .delete(this.DELETE_URL, { params })
      .pipe(map((d: any) => d));
  }
}
