import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { ClassSubjectMapping } from '../models/class-subject-mapping.model';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';

@Injectable({
  providedIn: 'root',
})
export class ClassSubjectMappingService extends ResourceService<ClassSubjectMapping> {
  private END_POINT = `api/class-subject-mapping`;
  private BASE = `${environment.baseUrl}${environment.authApiUrl}`;

  private SAVE_URL = `${this.BASE}/${this.END_POINT}/create`;
  private BULK_SAVE_URL = `${this.BASE}/${this.END_POINT}/bulk-create`;
  private UPDATE_URL = `${this.BASE}/${this.END_POINT}/update`;
  private DELETE_URL = `${this.BASE}/${this.END_POINT}/delete`;
  private SINGLE_URL = `${this.BASE}/${this.END_POINT}/find`;
  private BY_CLASS_URL = `${this.BASE}/${this.END_POINT}/by-class`;
  private ALL_CLASSES_URL = `${environment.baseUrl}${environment.authApiUrl}/api/class/all`;
  private ALL_GROUPS_URL = `${environment.baseUrl}${environment.authApiUrl}/api/group-version/all`;
  private ALL_SUBJECTS_URL = `${environment.baseUrl}${environment.authApiUrl}/api/subject-master/all`;

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'api/class-subject-mapping',
      new HrBuSerializer(),
      authService,
    );
  }

  getSingle(id: any) {
    const params = new HttpParams().append('id', id);
    return this.http
      .get(this.SINGLE_URL, { params })
      .pipe(map((data: any) => data.obj));
  }

  save(data: any) {
    return this.http.post(this.SAVE_URL, data).pipe(map((data: any) => data));
  }

  bulkSave(data: any) {
    return this.http
      .post(this.BULK_SAVE_URL, data)
      .pipe(map((data: any) => data));
  }

  override update(data: any) {
    return this.http.put(this.UPDATE_URL, data).pipe(map((data: any) => data));
  }

  override delete(id: string | number) {
    const params = new HttpParams().append('id', id);
    return this.http
      .delete(this.DELETE_URL, { params })
      .pipe(map((data: any) => data));
  }

  getByClass(classMasterNo: number, groupVersionNo?: number) {
    let params = new HttpParams().append('classMasterNo', classMasterNo);
    if (groupVersionNo) {
      params = params.append('groupVersionNo', groupVersionNo);
    }
    return this.http
      .get(this.BY_CLASS_URL, { params })
      .pipe(map((data: any) => data.obj));
  }

  getAllClasses() {
    return this.http.get(this.ALL_CLASSES_URL).pipe(map((data: any) => data));
  }

  getAllGroups() {
    return this.http.get(this.ALL_GROUPS_URL).pipe(map((data: any) => data));
  }

  getAllSubjects() {
    return this.http.get(this.ALL_SUBJECTS_URL).pipe(map((data: any) => data));
  }
}
