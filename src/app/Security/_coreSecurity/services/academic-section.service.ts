import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { AcademicSection } from '../models/academic-section.model';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';

@Injectable({
  providedIn: 'root',
})
export class AcademicSectionService extends ResourceService<AcademicSection> {
  private END_POINT = `api/section`;
  private SAVE_SECTION = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/create`;
  private UPDATE_SECTION = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
  private DELETE_SECTION = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/delete`;
  private SINGLE_SECTION = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find`;

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'api/section',
      new HrBuSerializer(),
      authService,
    );
  }

  getSingleSection(academicSectionNo: any) {
    console.log('fn', academicSectionNo);
    const params = new HttpParams().append('id', academicSectionNo);
    return this.http
      .get(this.SINGLE_SECTION, { params })
      .pipe(map((data: any) => data.obj));
  }
  saveSection(data: any) {
    return this.http
      .post(this.SAVE_SECTION, data)
      .pipe(map((data: any) => data));
  }
  updateSection(data: any) {
    return this.http
      .put(this.UPDATE_SECTION, data)
      .pipe(map((data: any) => data));
  }
  deleteSection(data: string | number | boolean) {
    const params = new HttpParams().append('id', data);
    return this.http
      .delete(this.DELETE_SECTION, { params })
      .pipe(map((data: any) => data));
  }
}
