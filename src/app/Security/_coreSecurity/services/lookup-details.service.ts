import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { LookupDetail } from '../models/lookup-details.model';
import { LookupDetailSerializer } from '../serializers/lookup-detail-serializer';

@Injectable({
  providedIn: 'root',
})
export class LookupDetailService extends ResourceService<LookupDetail> {
  private END_POINT = `lookup-details`;
  private ALL_LOOKUP_DETAILS = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/lookupDetailList`;
  private LOOK_UP_DETAIL_LIST_BY_LOOKUP_PARENT_NUMBER = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/lookupDetailListByLookupParentNo`;

  constructor(
    httpClient: HttpClient,
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      httpClient,
      environment.authApiUrl,
      'lookup-details',
      new LookupDetailSerializer(),
      authService,
    );
  }

  // Get all look up details list for service holder(registration initial data)
  getAllLookUpDetailsList(): Observable<any> {
    return this.http.get<any>(this.ALL_LOOKUP_DETAILS);
  }

  // Get all look up details list by parent look up number for service holder
  getAllLookUpDetailsListByLookupParentNumber(
    params: HttpParams,
  ): Observable<any> {
    const token = this.authService.getAccessToken(); // get token from your auth service
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      this.LOOK_UP_DETAIL_LIST_BY_LOOKUP_PARENT_NUMBER,
      { params, headers },
    );
  }
}
