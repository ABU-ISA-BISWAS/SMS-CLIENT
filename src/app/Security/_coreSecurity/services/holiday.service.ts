import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { Holiday } from '../models/holiday.model';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';

@Injectable({ providedIn: 'root' })
export class HolidayService extends ResourceService<Holiday> {
  private END_POINT = `api/holiday`;
  private BASE = `${environment.baseUrl}${environment.authApiUrl}`;

  private SAVE_URL = `${this.BASE}/${this.END_POINT}/create`;
  private UPDATE_URL = `${this.BASE}/${this.END_POINT}/update`;
  private DELETE_URL = `${this.BASE}/${this.END_POINT}/delete`;
  private SINGLE_URL = `${this.BASE}/${this.END_POINT}/find`;
  private ALL_SESSIONS_URL = `${this.BASE}/api/session/all`;

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'api/holiday',
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

  override update(data: any) {
    return this.http.put(this.UPDATE_URL, data).pipe(map((data: any) => data));
  }

  override delete(id: string | number) {
    const params = new HttpParams().append('id', id);
    return this.http
      .delete(this.DELETE_URL, { params })
      .pipe(map((data: any) => data));
  }

  getAllSessions() {
    return this.http.get(this.ALL_SESSIONS_URL).pipe(map((data: any) => data));
  }
}
