import { Injectable } from '@angular/core';
import { Navigation } from '../models/navigation.model'; 
import { ResourceService } from '../../auth/_service/resource.service'; 
import { NavigationSerializer } from '../serializers/navigation-serializer.serializer'; 
import { environment } from '../../../environments/environment'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth/_service/auth-service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService extends ResourceService<Navigation>{

  private END_POINT = `api/coreUser`;
  private MENU_LIST_AUTH = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find-user-menu`;
  private MENU_LIST_JSON = `./assets/json/nevigation-data.json`;


  constructor(
    httpClient: HttpClient,
     private http: HttpClient,
     authService: AuthService
    ) {
    super(httpClient, environment.authApiUrl, `api/coreUser`, new NavigationSerializer(), authService);
  }

 
  getMenuList(): Observable<any> {
    return this.http.get<any>(this.MENU_LIST_JSON).pipe(
      map((data: any) => data
      ));
  }

  getAuthMenuList(): Observable<any> {
    return this.http.get<any>(this.MENU_LIST_AUTH).pipe(
      map((data: any) => data
      ));
  }

}
