import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Feature } from '../_interface/feature';

@Injectable({
  providedIn: 'root'
})
export class GrantFeatureService {

  private END_POINT = `api/coreUser`;
  private MENU_LIST_AUTH = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find-user-menu`;

  private featuresSubject = new BehaviorSubject<Feature[]>([]);
  features$ = this.featuresSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  loadFeatures(): Observable<any> {
    return this.httpClient.get<any>(this.MENU_LIST_AUTH).pipe(
      tap(features => {
        console.log('Features Items:', features.items);
        this.featuresSubject.next(features.items);
      })
    );
  }

  getFeatures(): Feature[] {
    return this.featuresSubject.getValue();
  }
}
