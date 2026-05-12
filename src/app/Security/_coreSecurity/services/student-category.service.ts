import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';
import { StudentCategory } from '../models/student-category.model';

@Injectable({
  providedIn: 'root',
})
export class StudentCategoryService extends ResourceService<StudentCategory> {
  private END_POINT = `api/student-category`;
  private SAVE_STUDENT_CATEGORY = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/create`;
  private UPDATE_STUDENT_CATEGORY = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
  private DELETE_STUDENT_CATEGORY = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/delete`;
  private SINGLE_STUDENT_CATEGORY = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find`;

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'api/student-category',
      new HrBuSerializer(),
      authService,
    );
  }

  getSingleStudentCategory(studentCategoryNo: any) {
    console.log('fn', studentCategoryNo);
    const params = new HttpParams().append('id', studentCategoryNo);
    return this.http
      .get(this.SINGLE_STUDENT_CATEGORY, { params })
      .pipe(map((data: any) => data.obj));
  }
  saveStudentCategory(data: any) {
    return this.http
      .post(this.SAVE_STUDENT_CATEGORY, data)
      .pipe(map((data: any) => data));
  }
  updateStudentCategory(data: any) {
    return this.http
      .put(this.UPDATE_STUDENT_CATEGORY, data)
      .pipe(map((data: any) => data));
  }
  deleteStudentCategory(data: string | number | boolean) {
    const params = new HttpParams().append('id', data);
    return this.http
      .delete(this.DELETE_STUDENT_CATEGORY, { params })
      .pipe(map((data: any) => data));
  }
}
