import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { AcademicClass } from '../models/academic-class.model';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';

@Injectable({
  providedIn: 'root',
})
export class AcademicClassService extends ResourceService<AcademicClass> {
  private END_POINT = `api/class`;
  private SAVE_CLASS = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/create`;
  private UPDATE_CLASS = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
  private DELETE_CLASS = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/delete`;
  private SINGLE_CLASS = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find`;

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'api/features',
      new HrBuSerializer(),
      authService,
    );
  }

  getSingleClass(academicClassNo: any) {
    console.log('fn', academicClassNo);
    const params = new HttpParams().append('id', academicClassNo);
    return this.http
      .get(this.SINGLE_CLASS, { params })
      .pipe(map((data: any) => data.obj));
  }
  saveClass(data: any) {
    return this.http.post(this.SAVE_CLASS, data).pipe(map((data: any) => data));
  }
  updateClass(data: any) {
    return this.http
      .put(this.UPDATE_CLASS, data)
      .pipe(map((data: any) => data));
  }
  deleteClass(data: string | number | boolean) {
    const params = new HttpParams().append('id', data);
    return this.http
      .delete(this.DELETE_CLASS, { params })
      .pipe(map((data: any) => data));
  }
}
