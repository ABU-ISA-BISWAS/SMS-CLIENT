import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'; 
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserGrantDepartment } from '../models/user-grant-department.model';

@Injectable({
  providedIn: 'root'
})
export class UserGrantDepartmentService {
  
  private END_POINT = `api/user-grant-department`;
  private DEPT_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/list`;
  private SAVE_DEPT_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/save`;

  constructor(private http: HttpClient) { }


  getDepartmentWithUserGrantList(grantDepartment: UserGrantDepartment) {
    return this.http.post(this.DEPT_LIST, grantDepartment).pipe(
        map((data: any) => data
      ));
  }

  saveUserGrantDepartmentList(data: any) {
    return this.http.post(this.SAVE_DEPT_LIST, data).pipe(
        map((data: any) => data
      ));
  }


}
