import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MultiUserFoundService {
  private END_POINT = `${environment.baseUrl}${environment.freeAuthApiUrl}/multi-user-found`;

  private FIND_MULTI_USER = `${this.END_POINT}/findMultiuser`;

  constructor(private http: HttpClient) {}

  findMultiUser(searchObj: any): Observable<any> {
    return this.http
      .post<any>(this.FIND_MULTI_USER, searchObj)
      .pipe(map((data: any) => data));
  }
}
