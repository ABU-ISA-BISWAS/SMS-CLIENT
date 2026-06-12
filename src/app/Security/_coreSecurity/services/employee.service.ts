import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ResourceService } from '../../../auth/_service/resource.service';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../auth/_service/auth-service';
import { EmployeeModel } from '../models/employee.model';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService extends ResourceService<EmployeeModel> {
  private END_POINT = `api/employee`;
  private END_POINT_LOOKUP = `api/lookup`;

  private JOBLIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/jobtitle/list`;
  private DEPT_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/dept/list`;
  private SAVE_EMPLOYEE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/create`;
  private UPDATE_EMPLOYEE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
  private DELETE_EMP = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/delete`;
  private SINGLE_EMP = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/findByEmpNo`;
  private SINGLE_EMP_BY_ID = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/findByEmpId`;

  private ADD_SIGNATURE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/add-emp-signature`;
  private GET_SIGNATURE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/getEmpSignature`;
  private JOB_TITEL_AND_TYPE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT_LOOKUP}/job-title/all`;
  private JOB_TYPE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT_LOOKUP}/job-type/all`;
  private EMP_TYPE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT_LOOKUP}/emp-type/all`;
  private MERITAL_STATUS = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT_LOOKUP}/marital-status/all`;
  private DISTRICT = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT_LOOKUP}/district/all`;
  private GENDER = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT_LOOKUP}/gender/all`;
  private BLOOD_GROUP = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT_LOOKUP}/blood-grp/all`;
  private RELIGION = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT_LOOKUP}/religion/all`;
  private GUARDIAN_RELATION = `${environment.baseUrl}${environment.authApiUrl}/api/guardian-relation/all`;
  private FIND_EMPLOYEE_PHOTO = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find-employee-photo`;
  private UPDATE_EMPLOYEE_WITH_IMAGE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update-emp-with-image`;

  private SAVE_EMPLOYEE_WITH_IMAGE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/create-emp-with-image`;

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
  getGuardianRelation() {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.GUARDIAN_RELATION, { headers })
      .pipe(map((data: any) => data.items));
  }
  getJobTitle() {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.JOB_TITEL_AND_TYPE, { headers })
      .pipe(map((data: any) => data.items));
  }
  getJobType() {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.JOB_TYPE, { headers })
      .pipe(map((data: any) => data.items));
  }
  getEmpType() {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.EMP_TYPE, { headers })
      .pipe(map((data: any) => data.items));
  }
  getMaritalStatus() {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.MERITAL_STATUS, { headers })
      .pipe(map((data: any) => data.items));
  }
  getDistrict() {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.DISTRICT, { headers })
      .pipe(map((data: any) => data.items));
  }
  getGender() {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.GENDER, { headers })
      .pipe(map((data: any) => data.items));
  }
  getBloodGroup() {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.BLOOD_GROUP, { headers })
      .pipe(map((data: any) => data.items));
  }
  getReligion() {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.RELIGION, { headers })
      .pipe(map((data: any) => data.items));
  }

  // saveEmployee(data: any) {
  //   const token = this.authService.getAccessToken(); // get token from your auth service
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http
  //     .post(this.SAVE_EMPLOYEE, data, { headers })
  //     .pipe(map((data: any) => data));
  // }

  saveEmployeeWithImage(data: any, image: File) {
    const formData = new FormData();
    formData.append('reqobj', JSON.stringify(data));
    formData.append('file', image);
    return this.http
      .post(this.SAVE_EMPLOYEE_WITH_IMAGE, formData)
      .pipe(map((data: any) => data));
  }

  // updateEmployee(data: any) {
  //   const token = this.authService.getAccessToken(); // get token from your auth service
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http
  //     .put(this.UPDATE_EMPLOYEE, data, { headers })
  //     .pipe(map((data: any) => data));
  // }

  updateEmployeeWithImage(data: any, image: File) {
    const formData = new FormData();
    formData.append('reqobj', JSON.stringify(data));
    formData.append('file', image);
    return this.http
      .put(this.UPDATE_EMPLOYEE_WITH_IMAGE, formData)
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

  findEmployeePhoto(data: any) {
    const params = new HttpParams().append('empNo', data);
    return this.http.get<any>(this.FIND_EMPLOYEE_PHOTO, { params });
  }
}
