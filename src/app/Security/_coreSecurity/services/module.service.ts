import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { ModuleModel } from '../models/module.model';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';

@Injectable({
  providedIn: 'root',
})
export class ModuleService extends ResourceService<ModuleModel> {
  private END_POINT = `api/module`;
  private USER_FEATURE_ENDPOINT = `api/user-features`;
  private MODULE_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/module-feature-list`;
  private MODULE_LIST_ROLE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/module-feature-list-role`;
  private SAVE_MODULE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/create`;
  private UPDATE_MODULE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
  private DELETE_MODULE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/remove`;
  private FIND_SUBMODULES = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/subModuleList`;
  private SAVE_USER_FEATURE = `${environment.baseUrl}${environment.authApiUrl}/${this.USER_FEATURE_ENDPOINT}/create`;
  private FIND_PARENT_MODUL_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/parentModuleList`;

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

  saveModule(data: any) {
    return this.http
      .post(this.SAVE_MODULE, data)
      .pipe(map((data: any) => data));
  }

  saveFeatures(data: any) {
    return this.http
      .post(this.SAVE_USER_FEATURE, data)
      .pipe(map((data: any) => data));
  }

  updateModule(data: any) {
    return this.http
      .put(this.UPDATE_MODULE, data)
      .pipe(map((data: any) => data));
  }

  deleteModule(data: any) {
    const params = new HttpParams().append('id', data.id);
    return this.http
      .delete(this.DELETE_MODULE, { params })
      .pipe(map((data: any) => data));
  }

  findSubmodules() {
    return this.http.get(this.FIND_SUBMODULES).pipe(map((data: any) => data));
  }

  allModules(data?: any) {
    return this.http
      .post(this.MODULE_LIST, data)
      .pipe(map((data: any) => data));
  }

  allModulesRole(data?: any) {
    return this.http
      .post(this.MODULE_LIST_ROLE, data)
      .pipe(map((data: any) => data));
  }

  allPatentModules(data?: any) {
    return this.http
      .post(this.FIND_PARENT_MODUL_LIST, data)
      .pipe(map((data: any) => data.items));
  }

  getallModulesJSON(user?: any): Observable<any> {
    return this.http
      .get<any>('./assets/json/sub-menu-data.json')
      .pipe(map((data: any) => data));
  }
}
