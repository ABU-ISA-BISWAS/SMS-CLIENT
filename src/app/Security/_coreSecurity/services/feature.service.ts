import { ResourceService } from '../../../auth/_service/resource.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';
import { FeatureModel } from '../models/feature.model';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/_service/auth-service';


@Injectable({
    providedIn: 'root'
})
export class FeatureService extends ResourceService<FeatureModel> {

    private END_POINT = `api/features`;
    private SAVE_FEATURE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/create`;
    private UPDATE_FEATURE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
    private DELETE_FEATURE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/delete`;
    private SINGLE_FEATURE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find`;
    private COMPANY_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/list`;
    private VALIDATE_SUBMENUID = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/validate-submenu-id`;


    constructor(
        private http: HttpClient,
        authService: AuthService

    ) {
        super(http, environment.authApiUrl, "api/features", new HrBuSerializer(), authService);
    }

    getSingleFeature(featureNo: any) {
        console.log("fn", featureNo)
        const params = new HttpParams().append('id', featureNo);
        return this.http.get(this.SINGLE_FEATURE, { params }).pipe(
            map((data: any) => data.obj
            ));
    }
    saveFeature(data: any) {
        return this.http.post(this.SAVE_FEATURE, data).pipe(
            map((data: any) => data
            ));
    }
    updateFeature(data: any) {
        return this.http.put(this.UPDATE_FEATURE, data).pipe(
            map((data: any) => data
            ));
    }
    deleteFeature(data: string | number | boolean) {
        const params = new HttpParams().append('id', data);
        return this.http.delete(this.DELETE_FEATURE, { params }).pipe(
            map((data: any) => data
            ));
    }
    getCompanyList() {
        return this.http.get(this.COMPANY_LIST).pipe(
            map((data: any) => data
            ));
    }
    getIconList(): Observable<any> {
        return this.http.get('./assets/json/font-awesome.json').pipe(
            map((data: any) => data
            ));
    }

    validateFeatureCode(submenuId: string) {
        const params = new HttpParams().append('submenuId', submenuId);
        return this.http.get(this.VALIDATE_SUBMENUID, { params }).pipe(
            map((data: any) => data)
        )
    }

}