import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CustomCookieService } from './custom-cookie-service';
import { User } from '../_interface/user';
import { Feature } from 'datatables.net';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private AUTH_URL = `${environment.baseUrl}${environment.authApiUrl}/oauth/token`;
  private API_URL = `${environment.baseUrl}${environment.authApiUrl}/api`;
  private FAPI_URL = `${environment.baseUrl}${environment.authApiUrl}/fapi`;

  private DELETE_TOKEN_URL = `${this.AUTH_URL}/logout`;
  private AUTH_USER_DETAILS = `${this.API_URL}/coreUser/user-details`;
  private USER_GRANTED_COMPANY = `${this.FAPI_URL}/user-company/userCompany`;

  private CREATE_OTP = `${this.FAPI_URL}/otp/create`;
  private CHECK_OTP = `${this.FAPI_URL}/otp/checkOtp`;

  private CLIENT_ID = 'medClientIdPassword';
  private PASSWORD = 'secret';
  private GRANT_TYPE = 'password';

  public _isLoading = false;
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private errorMgs: BehaviorSubject<string> = new BehaviorSubject<string>('');

  userDetils: any = {};
  localStorageObj: any = {};
  featureList: Feature[] = [];

  get isLoggedIn() {
    this.checkCredentials();
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private cookie: CustomCookieService,
    private ngZone: NgZone
  ) { }

  obtainAccessToken(user: User) {

    this._isLoading = true;
    this.isLoading.next(this._isLoading);

    const params = new HttpParams()
      .set('username', user.userName)
      .set('password', user.password)
      .set('grant_type', this.GRANT_TYPE)
      .set('client_id', this.CLIENT_ID);

    const headers = {
      'Authorization': 'Basic ' + btoa(`${this.CLIENT_ID}:${this.PASSWORD}`),
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
    };

    this.httpClient.post<any>(this.AUTH_URL, params.toString(), { headers }).pipe(
      map(res => res))
      .subscribe(
        data => {
          this.saveToken(data);
          this._isLoading = false;
          this.isLoading.next(this._isLoading);
          this.errorMgs.next('');
        },
        err => {
          this._isLoading = false;
          this.isLoading.next(this._isLoading);
          console.error('Credentials error ', err);
          let errorMessage = navigator.onLine ? err.error.error_description : 'Please check your internet connection or try again later';

          if (errorMessage === undefined) {
            errorMessage = 'Service not available, please contact with Administrator';
          }
          this.errorMgs.next(errorMessage);
        }
      );

  }

  loadingStatus(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  messStatus(): Observable<string> {
    return this.errorMgs.asObservable();
  }

  saveToken(token: any) {
    const expireDate = token.expires_in;
    this.cookie.setWithExpiryInSeconds('access_token', token.access_token, expireDate);
    this.setUserInformation();
  }

  setUserInformation(): void {

    const accessToken = this.cookie.get('access_token');  // get your token

    if (!accessToken) {
      console.error('No access token found!');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });

    this.httpClient.get<any>(this.AUTH_USER_DETAILS, { headers }).subscribe(
      res => {
        this.userDetils = res;
        localStorage.clear();
        if (this.userDetils.obj) {
          localStorage.setItem('userInfo', JSON.stringify(this.userDetils.obj));
          this.router.navigate(['/']);
          // if (this.userDetils.obj.userDefaultPageLink) {
          //   this.router.navigate([this.userDetils.obj.userDefaultPageLink]);
          // } else {
          //   this.router.navigate(['/']);
          // }
        } else {
          localStorage.setItem('userInfo', JSON.stringify(null));
          this.router.navigate(['/']);
        }
      },
      err => {
        localStorage.clear();
        localStorage.setItem('userInfo', JSON.stringify(null));
        this.router.navigate(['/']);
        console.log('Error : ', err);
      });
  }

  getResource(resourceUrl: any): Observable<any> {
    const headers = {
      'Authorization': 'Bearer ' + this.cookieService.get('access_token'),
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
    };
    return this.httpClient.get<any>(resourceUrl, { headers }).pipe(
      map((res: Response) => res),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getAccessToken(): any {
    return this.cookie.get('access_token');
  }

  refreshAccessToken(): Observable<any> {
    console.log('Need Check.');
    const currentToken = this.obtainNewAccessToken();

    return of(this.obtainNewAccessToken()).pipe();
  }

  checkCredentials() {
    if (!this.cookie.get('access_token')) {
      this.loggedIn.next(false);
    } else {
      this.loggedIn.next(true);
    }
  }

  obtainNewAccessToken(): Observable<any> {
    return new Observable();
  }

  deleteToken(): Observable<any> {
    const headers = {
      'Authorization': 'Bearer ' + this.cookieService.get('access_token'),
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
    };

    return this.httpClient.delete<any>(this.DELETE_TOKEN_URL, { headers }).pipe(
      map((res: Response) => res),
      catchError((error: any) => { return throwError(error) })
    );
  }

  logout() {
    this.cookie.delete('access_token');
    this.cookie.delete('refresh_token');
    localStorage.clear();
    this.ngZone.run(() => {
      this.router.navigate(['/auth/signin']);
    });
  }

  getLoginCustomLayoutInfo(): Observable<any> {
    return this.httpClient.get<any>('json/login-custom-layout-info.json').pipe(
        map((data: any) => data)
    );
}
}
