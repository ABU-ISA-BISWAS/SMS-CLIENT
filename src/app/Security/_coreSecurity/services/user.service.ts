import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { UserModel } from '../models/user.model';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';
import { ModuleService } from './module.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ResourceService<UserModel> {
  private END_POINT = `api/coreUser`;
  private EMP_END_POINT = `api/employee`;
  private USER_UNIT_END_POINT = `api/unit-user-access`;
  private MODULE_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/findParent`;
  private SAVE_USER = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/save`;
  private UPDATE_USER = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
  private DELETE_USER = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/remove`;
  private FIND_SUBMODULES = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/subModuleList`;
  private FIND_EMP_BY_NAME_ID = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/findByNameOrId`;
  private FIND_EMP_BY_NO = `${environment.baseUrl}${environment.authApiUrl}/${this.EMP_END_POINT}/findByEmpNo`;
  private VALIDATE_NAME = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/validateUserName`;
  private VALIDATE_ID = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/validateUserId`;
  private VALIDATE_EXISTING = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/validateExisting`;
  private FIND_BY_ID = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find`;
  private CHANGE_PASS_ADMIN = `${environment.baseUrl}${environment.authApiUrl}/api/changePasswordByAdmin`;
  private REPORTING_DOCTOR_FIND_BY_ID = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find-reporting-doctor`;
  private REPORTING_SCIENTIFIC_FIND_BY_ID = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find-reporting-scientific-officer`;
  private REPORTING_PREPARED_FIND_BY_ID = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find-reporting-prepared-by`;

  private UNIT_LIST_URL = `${environment.baseUrl}${environment.authApiUrl}/${this.USER_UNIT_END_POINT}/unit-list`;
  private UNIT_USER_UPDATE_URL = `${environment.baseUrl}${environment.authApiUrl}/${this.USER_UNIT_END_POINT}/update-unit-user`;
  private DISABLE_USER = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/enable-disable-user`;

  private FIND_USER_BY_NAME_ID = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find-by-User-Name-Or-Id`;

  constructor(
    private http: HttpClient,
    private moduleService: ModuleService,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'api/module',
      new HrBuSerializer(),
      authService,
    );
  }

  saveUser(data: any) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(this.SAVE_USER, data).pipe(map((data: any) => data));
  }
  updateUser(data: any) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(this.UPDATE_USER, data).pipe(map((data: any) => data));
  }

  chagnePasswordByAdmin(data: any) {
    return this.http
      .post(this.CHANGE_PASS_ADMIN, data)
      .pipe(map((data: any) => data));
  }

  deleteModule(data: { id: string | number | boolean }) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const params = new HttpParams().append('id', data.id);
    return this.http
      .delete(this.DELETE_USER, { params, headers })
      .pipe(map((data: any) => data));
  }

  findSubmodules() {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.FIND_SUBMODULES, { headers })
      .pipe(map((data: any) => data));
  }

  allModules() {
    return this.moduleService.allModules();
  }

  // need to change method on backend
  getEmpListByNameID(data: any): Observable<any> {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .post(this.FIND_EMP_BY_NAME_ID, data)
      .pipe(map((data: any) => data.items));
  }

  findEmpByNo(data: string | number | boolean) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const params = new HttpParams().append('empNo', data);
    return this.http
      .get(this.FIND_EMP_BY_NO, { params, headers })
      .pipe(map((data: any) => data.obj));
  }

  findUserById(data: string | number | boolean) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const params = new HttpParams().append('id', data);
    return this.http
      .get(this.FIND_BY_ID, { params, headers })
      .pipe(map((data: any) => data.obj));
  }

  validateName(data: any) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .post(this.VALIDATE_NAME, { data, headers })
      .pipe(map((data: any) => data));
  }

  validateId(data: any) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .post(this.VALIDATE_ID, { data, headers })
      .pipe(map((data: any) => data));
  }

  validateExisting(data: any) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .post(this.VALIDATE_EXISTING, { data, headers })
      .pipe(map((data: any) => data));
  }

  findReportingDoctorById(userNo: any) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    // const obj: any = {};
    // obj.userNo = userNo;
    return this.http
      .post(this.REPORTING_DOCTOR_FIND_BY_ID, userNo)
      .pipe(map((data: any) => data));
  }

  findReportingScientificOfficerById(userNo: any) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    // const obj: any = {};
    // obj.userNo = userNo;
    return this.http
      .post(this.REPORTING_SCIENTIFIC_FIND_BY_ID, userNo)
      .pipe(map((data: any) => data));
  }

  findReportingPreparedOfficerById(userNo: any) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    // const obj: any = {};
    // obj.userNo = userNo;
    return this.http
      .post(this.REPORTING_PREPARED_FIND_BY_ID, userNo)
      .pipe(map((data: any) => data));
  }

  getUnitList() {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.UNIT_LIST_URL, { headers })
      .pipe(map((data: any) => data));
  }

  updateUnitUser(reqParam: any) {
    return this.http
      .put(this.UNIT_USER_UPDATE_URL, reqParam)
      .pipe(map((data: any) => data));
  }

  disableUser(data: any) {
    return this.http
      .put(this.DISABLE_USER, data)
      .pipe(map((data: any) => data));
  }

  getUserListByNameID(data: any): Observable<any> {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .post(this.FIND_USER_BY_NAME_ID, data)
      .pipe(map((data: any) => data.items));
  }
}
