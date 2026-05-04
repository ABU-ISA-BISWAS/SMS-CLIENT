import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  private END_POINT = `${environment.baseUrl}${environment.freeAuthApiUrl}/forgot-password`;
  private END_POINT_OTP = `${environment.baseUrl}${environment.freeAuthApiUrl}/otp`;

  private SEARCH_USER = `${this.END_POINT}/searchUser`;
  private CREATE_OTP = `${this.END_POINT_OTP}/create`;
  private CHECK_OTP = `${this.END_POINT_OTP}/checkOtp`;
  private RESET_PASSWORD = `${this.END_POINT_OTP}/resetPassword`;

  constructor(private http: HttpClient) {}

  searchUser(searchObj: any): Observable<any> {
    return this.http
      .post<any>(this.SEARCH_USER, searchObj)
      .pipe(map((data: any) => data));
  }

  createOtp(searchObj: any): Observable<any> {
    return this.http
      .post<any>(this.CREATE_OTP, searchObj)
      .pipe(map((data: any) => data));
  }

  checkOtp(reqObj: any): Observable<any> {
    return this.http
      .post<any>(this.CHECK_OTP, reqObj)
      .pipe(map((data: any) => data));
  }

  resetPassword(reqObj: any): Observable<any> {
    return this.http
      .post<any>(this.RESET_PASSWORD, reqObj)
      .pipe(map((data: any) => data));
  }
}
