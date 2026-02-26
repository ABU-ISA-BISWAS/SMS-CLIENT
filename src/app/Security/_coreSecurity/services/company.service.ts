import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { CompanyModel } from '../models/company.model';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';

@Injectable({
  providedIn: 'root',
})
export class CompanyService extends ResourceService<CompanyModel> {
  private END_POINT = `api/company`;
  private SAVE_COMPANY = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/create`;
  private UPDATE_COMPANY = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
  private SINGLE_COMPANY = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/findCompany`;
  private COMPANY_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/list`;

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'api/company',
      new HrBuSerializer(),
      authService,
    );
  }

  getSingleCompany(companyNo: any) {
    const params = new HttpParams().append('id', companyNo);
    return this.http
      .get(this.SINGLE_COMPANY, { params })
      .pipe(map((data: any) => data.obj));
  }
  saveCompany(data: any) {
    return this.http
      .post(this.SAVE_COMPANY, data)
      .pipe(map((data: any) => data));
  }
  updateCompany(data: any) {
    return this.http
      .put(this.UPDATE_COMPANY, data)
      .pipe(map((data: any) => data));
  }

  getCompanyList() {
    return this.http.get(this.COMPANY_LIST).pipe(map((data: any) => data));
  }
}
