import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ResourceService } from '../../../auth/_service/resource.service';
import { LookupDetail } from '../models/lookup-details.model';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../auth/_service/auth-service';
import { DoctorModel } from '../models/doctor.model';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService extends ResourceService<LookupDetail> {
  private END_POINT = `api/employee`;

  private JOBLIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/jobtitle/list`;
  private DEPT_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/dept/list`;
  private SAVE_EMPLOYEE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/create`;
  private UPDATE_EMPLOYEE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
  private DELETE_EMP = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/delete`;
  private SINGLE_EMP = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/findByEmpNo`;
  private SINGLE_EMP_BY_ID = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/findByEmpId`;
  private INIT_EMP_DATA_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/init-emp-lists`;
  private SEARCH_BY_PERSONAL_NUMBER = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/findByPersonalNumber`;

  private ADD_SIGNATURE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/add-emp-signature`;
  private GET_SIGNATURE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/getEmpSignature`;

  private doctorSource = new Subject<DoctorModel>();
  doctorObject = this.doctorSource.asObservable();

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'api/employee/jobtitle/list',
      new HrBuSerializer(),
      authService,
    );
  }

  sendDoctor(data: DoctorModel) {
    this.doctorSource.next(data);
  }

  getSingleEmployee(empNo: string | number | boolean) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const params = new HttpParams().append('empNo', empNo.toString());

    return this.http
      .get(this.SINGLE_EMP, { params, headers })
      .pipe(map((data: any) => data.obj));
  }

  validateEmpId(data: string | number | boolean) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const params = new HttpParams().append('empId', data.toString());

    return this.http
      .get(this.SINGLE_EMP_BY_ID, { params, headers })
      .pipe(map((data: any) => data));
  }

  getDeptName() {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.DEPT_LIST, { headers })
      .pipe(map((data: any) => data.items));
  }

  getJobTitleList() {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.JOBLIST, { headers })
      .pipe(map((data: any) => data.items));
  }

  saveEmployee(data: any) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .post(this.SAVE_EMPLOYEE, data, { headers })
      .pipe(map((data: any) => data));
  }

  updateEmployee(data: any) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .put(this.UPDATE_EMPLOYEE, data, { headers })
      .pipe(map((data: any) => data));
  }

  public deleteEmployeeById(id: string): Observable<any> {
    const token = this.authService.getAccessToken(); // Assuming it returns a valid token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const options = {
      headers,
      params: new HttpParams().set('id', id),
    };

    return this.http
      .delete<any>(this.DELETE_EMP, options)
      .pipe(map((response) => response));
  }

  initEmpSetupList() {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.INIT_EMP_DATA_LIST, { headers })
      .pipe(map((data: any) => data));
  }

  searchByPersonalNumber(data: string | number | boolean) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const params = new HttpParams().append('personalNumber', data);
    return this.http
      .get(this.SEARCH_BY_PERSONAL_NUMBER, { params, headers })
      .pipe(map((data: any) => data));
  }

  addEmpSignature(empObj: any, image: File) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const formData = new FormData();
    formData.append('reqobj', JSON.stringify(empObj));
    formData.append('file', image);
    return this.http
      .post(this.ADD_SIGNATURE, formData, { headers })
      .pipe(map((data) => data));
  }
  getEmployeeSignature(data: { id: string | number | boolean }) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const params = new HttpParams().append('empNo', data.id);
    return this.http.get(this.GET_SIGNATURE, { params, headers });
  }
}
