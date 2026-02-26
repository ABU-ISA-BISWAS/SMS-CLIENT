import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResourceService } from '../../../auth/_service/resource.service';
import { Department } from '../models/department.model';

import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../auth/_service/auth-service';
import { DepartmentSerializers } from '../serializers/department.serializer';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService extends ResourceService<Department> {
  private END_POINT = `api/employee/dept`;
  private DEPARTMENT_STATUS_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/list`;
  private DEPARTMENT_PARENT_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/findParent`;
  private DEPARTMENT_SAVE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/save`;
  private DEPARTMENT_UPDATE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
  private DEPARTMENT_DELETE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/delete`;
  private OPD_DEP_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/getOpdDepList`;
  private DEPT_BY_NO = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/getByNo`;
  private DEPARTMENT_LIST_BY_USER_NO = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/dept-by-user-no`;

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'employee/dept',
      new DepartmentSerializers(),
      authService,
    );
  }

  getDepartmentList(department: Department): Observable<any> {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.DEPARTMENT_STATUS_LIST, { headers })
      .pipe(map((data: any) => data));
  }

  getDepartmentParentList(): Observable<any> {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.DEPARTMENT_PARENT_LIST, { headers })
      .pipe(map((data: any) => data));
  }

  public deleteDepartment(id: string) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(`${(this.DEPARTMENT_DELETE, { headers })}`, {
      params: new HttpParams().set('id', id),
    });
  }

  getDepartmentByNo(_id: string) {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.DEPT_BY_NO, {
        params: new HttpParams().set('id', _id),
        headers,
      })
      .pipe(map((data: any) => data.obj));
  }

  getOpdDepartmentList(): Observable<any> {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.OPD_DEP_LIST, { headers })
      .pipe(map((data: any) => data));
  }

  createDepartment(department: Department) {
    return this.http
      .post(this.DEPARTMENT_SAVE, department)
      .pipe(map((data: any) => data));
  }

  updateDepartment(department: Department) {
    return this.http
      .put(this.DEPARTMENT_UPDATE, department)
      .pipe(map((data: any) => data));
  }

  getDepartmentListByUserNo(): Observable<any> {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get(this.DEPARTMENT_LIST_BY_USER_NO, { headers })
      .pipe(map((data: any) => data));
  }
}
