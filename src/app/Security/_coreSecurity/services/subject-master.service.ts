import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';
import { SubjectMaster } from '../models/subject-master.model';

@Injectable({
  providedIn: 'root',
})
export class SubjectMasterService extends ResourceService<SubjectMaster> {
  private END_POINT = `api/subject-master`;
  private SAVE_SUBJECT = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/create`;
  private UPDATE_SUBJECT = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
  private DELETE_SUBJECT = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/delete`;
  private SINGLE_SUBJECT = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find`;

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'api/subject-master',
      new HrBuSerializer(),
      authService,
    );
  }

  getSingleSubject(subjectNo: any) {
    console.log('fn', subjectNo);
    const params = new HttpParams().append('id', subjectNo);
    return this.http
      .get(this.SINGLE_SUBJECT, { params })
      .pipe(map((data: any) => data.obj));
  }
  saveSubject(data: any) {
    return this.http.post(this.SAVE_SUBJECT, data).pipe(map((data: any) => data));
  }
  updateSubject(data: any) {
    return this.http
      .put(this.UPDATE_SUBJECT, data)
      .pipe(map((data: any) => data));
  }
  deleteSubject(data: string | number | boolean) {
    const params = new HttpParams().append('id', data);
    return this.http
      .delete(this.DELETE_SUBJECT, { params })
      .pipe(map((data: any) => data));
  }
}
