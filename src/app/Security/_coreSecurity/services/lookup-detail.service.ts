import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { OpdLookupDetail } from '../models/lookup-detail.model';
import { OpdLookupDetailSerializer } from '../serializers/lookup-detail.serializer';

@Injectable({
  providedIn: 'root',
})
export class OpdLookupDetailService extends ResourceService<OpdLookupDetail> {
  private END_POINT = `lookup-details`;
  private RANK_GRID_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/rankGridList`;

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'lookup-details',
      new OpdLookupDetailSerializer(),
      authService,
    );
  }

  getRankGridList(params: HttpParams): Observable<any> {
    return this.http.get<any>(this.RANK_GRID_LIST, { params });
  }

  getServiceCategoryList(): Observable<any[]> {
    let serviceCategory = new OpdLookupDetail();
    return this.customeList('list-service-category', serviceCategory);
  }
}
