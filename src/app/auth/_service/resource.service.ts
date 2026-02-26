import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Resource } from '../_model/resource.model';
import { Serializer } from '../_interface/serializer';
import { AuthService } from './auth-service';

export class ResourceService<T extends Resource> {

  private RESOURCE_LIST = `list`;
  private RESOURCE_CREATE = `create`;
  private RESOURCE_CREATE_WITH_IMAGE = `create-with-image`;
  private RESOURCE_CREATE_WITH_VALIDITY = `save-reg-with-validity`;
  private RESOURCE_UPDATE_WITH_IMAGE = `update-with-image`;
  private RESOURCE_UPDATE = `update`;
  private RESOURCE_DELETE = `delete`;
  private RESOURCE_INACTIVATED = `inactivate`;
  private RESOURCE_SOFT_DELETE = `soft-delete`;
  private RESOURCE_REMOVE = `remove`;
  private BASE_URL = environment.baseUrl;

  protected authService!: AuthService;

  constructor(
    private httpClient: HttpClient,
    private apiUrl: string,
    private endpoint: string,
    private serializer: Serializer,
    authService: AuthService) { this.authService = authService; }

  public uploadImage(image_url: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', image);

    return this.httpClient
      .post(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${image_url}`, formData).pipe(
        map(data => data)
      );
  }

  public createWithImage(item: T, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('reqobj', JSON.stringify(this.serializer.toJson(item)));
    formData.append('file', image);

    const token = this.authService.getAccessToken();  // get token from your auth service
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient
      .post<any>(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${this.RESOURCE_CREATE_WITH_IMAGE}`, formData, { headers }).pipe(
        map(data => data)
      );
  }

  public saveRegWithValidity(item: T, image: File, referenceNo: any): Observable<any> {
    const formData = new FormData();
    formData.append('reqobj', JSON.stringify(this.serializer.toJson(item)));
    formData.append('file', image);
    formData.append('referenceNo', referenceNo);

    return this.httpClient
      .post<any>(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${this.RESOURCE_CREATE_WITH_VALIDITY}`, formData).pipe(
        map(data => data)
      );
  }
  public create(item: T): Observable<T> {
    return this.httpClient
      .post<any>(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${this.RESOURCE_CREATE}`,
        this.serializer.toJson(item)).pipe(
          map(data => data.obj && this.serializer.fromJson(data.obj) as T)
        );
  }

  public createNew(item: T): Observable<T> {
    return this.httpClient
      .post<any>(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${this.RESOURCE_CREATE}`, this.serializer.toJson(item)).pipe(
        map(data => data)
      );
  }

  public updateWithImage(item: T, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('reqobj', JSON.stringify(this.serializer.toJson(item)));
    formData.append('file', image);

    const token = this.authService.getAccessToken();  // get token from your auth service
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient
      .put<any>(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${this.RESOURCE_UPDATE_WITH_IMAGE}`, formData, { headers }).pipe(
        map(data => data)
      );
  }

  public update(item: T): Observable<T> {
    return this.httpClient
      .put<any>(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${this.RESOURCE_UPDATE}`,
        this.serializer.toJson(item)).pipe(
          map(data => data.obj && this.serializer.fromJson(data.obj) as T)
        );
  }

  public updatePrescription(item: T): Observable<T> {
    return this.httpClient
      .put<any>(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${this.RESOURCE_UPDATE}`,
        this.serializer.toJson(item)).pipe(
          map((data: any) => data)
        );
  }

  public updateNew(item: T): Observable<T> {
    return this.httpClient
      .put<any>(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${this.RESOURCE_UPDATE}`,
        this.serializer.toJson(item)).pipe(
          map((data: any) => data)
        );
  }

  // read(id: number): Observable<T> {
  //   return this.httpClient
  //     .get(`${this.BASE_URL}:${this.apiUrl}/${this.endpoint}/${id}`).pipe(
  //       map((data: any) => this.serializer.fromJson(data) as T)
  //     )
  // }

  public getSearch(mappingUrl: string, reqItem: T): Observable<T[]> {
    return this.httpClient
      .get(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${mappingUrl}`).pipe(
        map((data: any) => data)
      );
  }

  public search(mappingUrl: string, reqItem: T): Observable<T> {
    return this.httpClient
      .post<any>(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${mappingUrl}`, reqItem).pipe(
        map((data: any) => data)
      );
  }

  public customeList(mappingUrl: string, item: T): Observable<T[]> {
    return this.httpClient
      .post<any>(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${mappingUrl}`, this.serializer.toJson(item)).pipe(
        map((data: any) => this.convertData(data.items))
      );
  }

  public customeListGet(mappingUrl: string, item: T): Observable<T[]> {
    return this.httpClient
      .get(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${mappingUrl}`, this.serializer.toJson(item)).pipe(
        map((data: any) => this.convertData(data.items))
      );
  }

  public findDashboardModuleList(mappingUrl: string, item: T): Observable<T[]> {

    return this.httpClient
      .get(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${mappingUrl}`, this.serializer.toJson(item)).pipe(
        map((data: any) => this.convertData(data.items))
      );
  }

  public getCustomObjects(optional: string, item: T): Observable<any> {
    return this.httpClient
      .get(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${optional}`, this.serializer.toJson(item)).pipe(
        map((data: any) => this.convertDataObject(data))
      );
  }

  public customParamList(optional: string, item: any): Observable<any> {
    return this.httpClient
      .post(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${optional}`, item).pipe(
        map((data: any) => data.model.itemList)
      );
  }
  public customParamObj(optional: string, item: any): Observable<any> {
    return this.httpClient
      .post(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${optional}`, item).pipe(
        map((data: any) => (this.isEmptyObject(data.model)) ? null : this.serializer.fromJson(data.model))
      );
  }

  public list(item: T): Observable<T[]> {
    return this.httpClient
      .post(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${this.RESOURCE_LIST}`, this.serializer.toJson(item)).pipe(
        map((data: any) => this.convertData(data.items))
      );
  }


  public delete(id: string) {
    return this.httpClient
      .delete<any>(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${this.RESOURCE_DELETE}`, {
        params: new HttpParams().set('id', id)
      });
  }

  public remove(id: string) {
    return this.httpClient
      .delete<any>(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${this.RESOURCE_REMOVE}`, {
        params: new HttpParams().set('id', id)
      });
  }

  public inactiveRegistation(id: string, cancelReason: string) {
    const token = this.authService.getAccessToken();  // get token from your auth service
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient
      .delete<any>(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${this.RESOURCE_INACTIVATED}`, {
        params: new HttpParams()
          .set('id', id)
          .set('reason', cancelReason), headers

      });
  }

  public softDelete(id: string, cancelReason: string) {
    const token = this.authService.getAccessToken();  // get token from your auth service
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient
      .delete<any>(`${this.BASE_URL}${this.apiUrl}/${this.endpoint}/${this.RESOURCE_SOFT_DELETE}`, {
        params: new HttpParams()
          .set('id', id)
          .set('reason', cancelReason), headers

      });
  }


  convertData(data: any): T[] {
    if (data) {
      return data.map((item: any) => this.serializer.fromJson(item));
    } else {
      return [];
    }
  }

  private convertDataObject(data: any) {
    if (data) {
      // return data.map(item => this.serializer.fromJson(item));
      return this.serializer.fromJson(data);
    } else {
      return null;
    }
  }

  isEmptyObject(obj: any) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }

}
