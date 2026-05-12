import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';
import { GuardianRelation } from '../models/guardian-relation.model';

@Injectable({
  providedIn: 'root',
})
export class GuardianRelationService extends ResourceService<GuardianRelation> {
  private END_POINT = `api/guardian-relation`;
  private SAVE_GUARDIAN_RELATION = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/create`;
  private UPDATE_GUARDIAN_RELATION = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
  private DELETE_GUARDIAN_RELATION = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/delete`;
  private SINGLE_GUARDIAN_RELATION = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find`;

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'api/guardian-relation',
      new HrBuSerializer(),
      authService,
    );
  }

  getSingleGuardianRelation(guardianRelationNo: any) {
    console.log('fn', guardianRelationNo);
    const params = new HttpParams().append('id', guardianRelationNo);
    return this.http
      .get(this.SINGLE_GUARDIAN_RELATION, { params })
      .pipe(map((data: any) => data.obj));
  }
  saveGuardianRelation(data: any) {
    return this.http
      .post(this.SAVE_GUARDIAN_RELATION, data)
      .pipe(map((data: any) => data));
  }
  updateGuardianRelation(data: any) {
    return this.http
      .put(this.UPDATE_GUARDIAN_RELATION, data)
      .pipe(map((data: any) => data));
  }
  deleteGuardianRelation(data: string | number | boolean) {
    const params = new HttpParams().append('id', data);
    return this.http
      .delete(this.DELETE_GUARDIAN_RELATION, { params })
      .pipe(map((data: any) => data));
  }
}
