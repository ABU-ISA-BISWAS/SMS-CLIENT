import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserFeatureService {

  private PREVILEDGE_URL = `${environment.baseUrl}${environment.authApiUrl}/api/module/find-user-content-access-list`;

  constructor(
    private http: HttpClient
  ) {
  }

  getAuthorizePreviledge(): Observable<any> {
    return this.http.post<any>(this.PREVILEDGE_URL, {}).pipe(map((data: any) => data));
  }


}
