import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { AcademicSession } from '../models/academic-session.model';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';

@Injectable({
  providedIn: 'root',
})
export class AcademicSessionService extends ResourceService<AcademicSession> {
  private END_POINT = `api/session`;
  private SAVE_SESSION = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/create`;
  private UPDATE_SESSION = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
  private DELETE_SESSION = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/delete`;
  private SINGLE_SESSION = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find`;

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'api/session',
      new HrBuSerializer(),
      authService,
    );
  }

  getSingleSession(academicSessionNo: any) {
    console.log('fn', academicSessionNo);
    const params = new HttpParams().append('id', academicSessionNo);
    return this.http
      .get(this.SINGLE_SESSION, { params })
      .pipe(map((data: any) => data.obj));
  }
  saveSession(data: any) {
    return this.http
      .post(this.SAVE_SESSION, data)
      .pipe(map((data: any) => data));
  }
  updateSession(data: any) {
    return this.http
      .put(this.UPDATE_SESSION, data)
      .pipe(map((data: any) => data));
  }
  deleteSession(data: string | number | boolean) {
    const params = new HttpParams().append('id', data);
    return this.http
      .delete(this.DELETE_SESSION, { params })
      .pipe(map((data: any) => data));
  }
}
