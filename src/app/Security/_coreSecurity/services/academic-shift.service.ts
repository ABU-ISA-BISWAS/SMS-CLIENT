import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { AcademicShift } from '../models/academic-shift.model';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';

@Injectable({
  providedIn: 'root',
})
export class AcademicShiftService extends ResourceService<AcademicShift> {
  private END_POINT = `api/shift`;
  private SAVE_SHIFT = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/create`;
  private UPDATE_SHIFT = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
  private DELETE_SHIFT = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/delete`;
  private SINGLE_SHIFT = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find`;

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'api/shift',
      new HrBuSerializer(),
      authService,
    );
  }

  getSingleShift(academicShiftNo: any) {
    console.log('fn', academicShiftNo);
    const params = new HttpParams().append('id', academicShiftNo);
    return this.http
      .get(this.SINGLE_SHIFT, { params })
      .pipe(map((data: any) => data.obj));
  }
  saveShift(data: any) {
    return this.http.post(this.SAVE_SHIFT, data).pipe(map((data: any) => data));
  }
  updateShift(data: any) {
    return this.http
      .put(this.UPDATE_SHIFT, data)
      .pipe(map((data: any) => data));
  }
  deleteShift(data: string | number | boolean) {
    const params = new HttpParams().append('id', data);
    return this.http
      .delete(this.DELETE_SHIFT, { params })
      .pipe(map((data: any) => data));
  }
}
