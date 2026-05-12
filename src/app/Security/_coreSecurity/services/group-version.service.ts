import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { GroupVersion } from '../models/group-version.model';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';

@Injectable({
  providedIn: 'root',
})
export class GroupVersionService extends ResourceService<GroupVersion> {
  private END_POINT = `api/group-version`;
  private SAVE_GROUP_VERSION = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/create`;
  private UPDATE_GROUP_VERSION = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
  private DELETE_GROUP_VERSION = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/delete`;
  private SINGLE_GROUP_VERSION = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find`;

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'api/group-version',
      new HrBuSerializer(),
      authService,
    );
  }

  getSingleGroupVersion(academicGroupVersionNo: any) {
    console.log('fn', academicGroupVersionNo);
    const params = new HttpParams().append('id', academicGroupVersionNo);
    return this.http
      .get(this.SINGLE_GROUP_VERSION, { params })
      .pipe(map((data: any) => data.obj));
  }
  saveGroupVersion(data: any) {
    return this.http
      .post(this.SAVE_GROUP_VERSION, data)
      .pipe(map((data: any) => data));
  }
  updateGroupVersion(data: any) {
    return this.http
      .put(this.UPDATE_GROUP_VERSION, data)
      .pipe(map((data: any) => data));
  }
  deleteGroupVersion(data: string | number | boolean) {
    const params = new HttpParams().append('id', data);
    return this.http
      .delete(this.DELETE_GROUP_VERSION, { params })
      .pipe(map((data: any) => data));
  }
}
