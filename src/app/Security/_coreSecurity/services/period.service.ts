import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { Period } from '../models/period.model';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';

@Injectable({ providedIn: 'root' })
export class PeriodService extends ResourceService<Period> {
  private END_POINT = `api/period-master`;
  private BASE = `${environment.baseUrl}${environment.authApiUrl}`;

  private SAVE_URL = `${this.BASE}/${this.END_POINT}/create`;
  private UPDATE_URL = `${this.BASE}/${this.END_POINT}/update`;
  private DELETE_URL = `${this.BASE}/${this.END_POINT}/delete`;
  private SINGLE_URL = `${this.BASE}/${this.END_POINT}/find`;
  private BY_BUILDING_URL = `${this.BASE}/${this.END_POINT}/by-building`;
  private ALL_SHIFT_URL = `${this.BASE}/api/shift/all`;

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'api/room',
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

  getByBuilding(buildingNo: number) {
    const params = new HttpParams().append('buildingNo', buildingNo);
    return this.http
      .get(this.BY_BUILDING_URL, { params })
      .pipe(map((data: any) => data.obj));
  }

  getAllShifts() {
    return this.http.get(this.ALL_SHIFT_URL).pipe(map((data: any) => data));
  }
}
