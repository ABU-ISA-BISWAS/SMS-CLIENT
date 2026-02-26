import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { OrganizationModel } from '../models/organization.model';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService extends ResourceService<OrganizationModel> {
  private END_POINT = `api/org`;
  private SAVE_ORG = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/create`;
  private UPDATE_EMPLOYEE = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
  private SINGLE_ORG = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/findOrgByNo`;

  private FIND_BY_OGNAME = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/findByName`;

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'api/org',
      new HrBuSerializer(),
      authService,
    );
  }

  getSingleOrg(orgNo: any) {
    const params = new HttpParams().append('orgNo', orgNo);
    return this.http
      .get(this.SINGLE_ORG, { params })
      .pipe(map((data: any) => data.obj));
  }
  saveOrg(data: any) {
    return this.http.post(this.SAVE_ORG, data).pipe(map((data: any) => data));
  }
  updateOrg(data: any) {
    return this.http
      .put(this.UPDATE_EMPLOYEE, data)
      .pipe(map((data: any) => data));
  }

  findOrgByName(orgName: any) {
    return this.http
      .post(this.FIND_BY_OGNAME, orgName)
      .pipe(map((data: any) => data.items));
  }
}
