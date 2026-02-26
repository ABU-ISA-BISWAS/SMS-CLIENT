import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserGrantRole } from '../models/user-grant-role.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserGrantRoleService {

  private END_POINT = `api/role/grant`;
  private SAVE_ROLE_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/save-role-list`;
  private ROLE_WITH_GRANT_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/role-with-grant-list`;
  private GET_ROLE_FEATURES = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/role-feautre-list`;
  private GET_ROLE_FEATURES_NEW = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/role-feautre-list-new`;
  private SAVE_INACTIVE_FEATURE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/save-inactive-feature`;


  constructor(private http: HttpClient) { }

  getRoleWithGrantList(grantRole: UserGrantRole) {
    return this.http.post(this.ROLE_WITH_GRANT_LIST, grantRole).pipe(
      map((data: any) => data
      ));
  }

  saveUserGrantRoleList(data: any) {
    return this.http.post(this.SAVE_ROLE_LIST, data).pipe(
      map((data: any) => data
      ));
  }

    getRoleFeatures(data: any ):Observable<any>{
    return this.http.post<any>(this.GET_ROLE_FEATURES, data).pipe(
      map((data: any) => data)
    );
  }

  getRoleFeaturesNew(_reqObj: any): Observable<any> {
    return this.http.post<any>(this.GET_ROLE_FEATURES_NEW, _reqObj).pipe(map((data: any) => data));
  }

  saveInactiveFeature(data: any) {
    return this.http.post(this.SAVE_INACTIVE_FEATURE, data).pipe(
      map((data: any) => data
      ));
  }
}
