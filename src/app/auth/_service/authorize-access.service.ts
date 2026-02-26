
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth-service';
import { ResourceService } from './resource.service';
@Injectable({
  providedIn: 'root'
})
export class AuthorizeAccessService {

  private PREVILEDGE_URL = `${environment.baseUrl}${environment.authApiUrl}/api/module/find-user-content-access-list`;

  // constructor(httpClient: HttpClient,private http:HttpClient) {
  //   super(httpClient, environment.pharmacyApiUrl, "module", new RouteSerializer())

  // }

  constructor(httpClient: HttpClient, private http: HttpClient, private authService: AuthService) {

  }


  getAuthorizePreviledge(): Observable<any> {
    const token = this.authService.getAccessToken();  // get token from your auth service
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(this.PREVILEDGE_URL, {},{headers}).pipe(
      map((data: any) => data
      ));
  }

}
