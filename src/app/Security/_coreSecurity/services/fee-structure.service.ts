import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { FeeStructure } from '../models/fee-structure.model';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';

@Injectable({
  providedIn: 'root',
})
export class FeeStructureService extends ResourceService<FeeStructure> {
  private END_POINT = `api/fee-structure`;
  private BASE = `${environment.baseUrl}${environment.authApiUrl}`;

  private SAVE_URL = `${this.BASE}/${this.END_POINT}/create`;
  private BULK_SAVE_URL = `${this.BASE}/${this.END_POINT}/bulk-save`;
  private UPDATE_URL = `${this.BASE}/${this.END_POINT}/update`;
  private DELETE_URL = `${this.BASE}/${this.END_POINT}/delete`;
  private SINGLE_URL = `${this.BASE}/${this.END_POINT}/find`;
  private BY_CLASS_URL = `${this.BASE}/${this.END_POINT}/by-class-session`;

  private ALL_SESSIONS_URL = `${this.BASE}/api/session/all`;
  private ALL_CLASSES_URL = `${this.BASE}/api/class/all`;
  private ALL_CATEGORIES_URL = `${this.BASE}/api/student-category/all`;
  private ALL_FEE_HEADS_URL = `${this.BASE}/api/fee-head/all`;

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'api/fee-structure',
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

  getByClassAndSession(
    sessionNo: number,
    classNo: number,
    categoryNo?: number,
  ) {
    let params = new HttpParams()
      .append('academicSessionNo', sessionNo)
      .append('classMasterNo', classNo);
    if (categoryNo) params = params.append('studentCategoryNo', categoryNo);
    return this.http
      .get(this.BY_CLASS_URL, { params })
      .pipe(map((data: any) => data.obj));
  }

  getAllSessions() {
    return this.http.get(this.ALL_SESSIONS_URL).pipe(map((data: any) => data));
  }

  getAllClasses() {
    return this.http.get(this.ALL_CLASSES_URL).pipe(map((data: any) => data));
  }

  getAllCategories() {
    return this.http
      .get(this.ALL_CATEGORIES_URL)
      .pipe(map((data: any) => data));
  }

  getAllFeeHeads() {
    return this.http.get(this.ALL_FEE_HEADS_URL).pipe(map((data: any) => data));
  }
}
