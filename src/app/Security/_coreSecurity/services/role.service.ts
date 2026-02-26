import { ResourceService } from '../../../auth/_service/resource.service'; 
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'; 
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';
import { RoleModel } from '../models/role.model';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/_service/auth-service';


@Injectable({
    providedIn: 'root'
})
export class RoleService extends ResourceService<RoleModel> {

    private END_POINT = `api/role`;
    private SAVE_ROLE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/save`;
    private UPDATE_ROLE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
    private ROLE_DELETE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/delete`;
    private SINGLE_ROLE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/findCompany`;
    private ROLE_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/list`;
    private ROLE_LIST_BY_USERNO = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/grant/findByUserNo`;
    private ACTIVE_INACTIVE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/enable-disable-role`;

    constructor(
        private http: HttpClient,
        authService: AuthService
        
    ) {
        super(http, environment.authApiUrl, "api/role", new HrBuSerializer(), authService);
    }

    getRoleList() {
        return this.http.post(this.ROLE_LIST, {}).pipe(
            map((data: any) => data.items)
        )
    }

    getRoleListByUserNo(params: any) {
        return this.http.get(this.ROLE_LIST_BY_USERNO, { params }).pipe(
            map((data: any) => data.items)
        )
    }
    // getSingleCompany(companyNo) {
    //     const params=new HttpParams().append('id',companyNo);
    //     return this.http.get(this.SINGLE_COMPANY,{params}).pipe(
    //         map((data:any)=>data.obj 
    //         ));
    // }
    // saveCompany(data) {
    //     return this.http.post(this.SAVE_COMPANY, data).pipe(
    //         map((data: any) => data
    //         ));
    // }
    // updateCompany(data) {
    //     return this.http.put(this.UPDATE_COMPANY, data).pipe(
    //         map((data: any) => data
    //         ));
    // }

    // getCompanyList(){
    //     return this.http.get(this.COMPANY_LIST).pipe(
    //         map((data: any) => data
    //         ));
    // }

    saveRole(data: any) {
        return this.http.post(this.SAVE_ROLE, data).pipe(
            map((data: any) => data
            ));
    }

    updateRole(data: any) {
        return this.http.put(this.UPDATE_ROLE, data).pipe(
            map((data: any) => data
            ));
    }


    deleteRole(reqObj: any): Observable<any> {
        const params = new HttpParams().set('id', reqObj);
        return this.http.delete<any>(this.ROLE_DELETE, { params }).pipe(
            map((data: any) => data
            ));
    }
     updateRoleActiveInactive(_reqObj: any): Observable<any> {
        return this.http.post<any>(this.ACTIVE_INACTIVE, _reqObj).pipe(map((data: any) => data));
      }
}