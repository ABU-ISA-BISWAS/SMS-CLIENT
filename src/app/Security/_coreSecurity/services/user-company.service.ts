import { Injectable } from '@angular/core';
import { ResourceService } from '../../../auth/_service/resource.service'; 
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'; 
import { UserCompanySerializer } from '../serializers/user-company-serializer';
import { UserCompany } from '../models/user-company.model';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/_service/auth-service';

@Injectable({
  providedIn: 'root'
})
export class UserCompanyService extends ResourceService<UserCompany>{

  // constructor(httpClient: HttpClient) {
  //   super(httpClient, environment.authApiUrl, "api/user-company", new UserCompanySerializer());
  // }

   constructor(
    http: HttpClient,
    authService: AuthService
  ) {
    super(http, environment.authApiUrl, "api/user-company", new UserCompanySerializer(), authService); 
  }

  getCompanies(): Observable<UserCompany[]> {
    return this.customeListGet('userCompany',new UserCompany());
  }

}
