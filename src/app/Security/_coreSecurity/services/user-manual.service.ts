import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class UserManualService {

  private END_POINT = `api/user-manual`;
  private BASE_URL = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}`;

  private LIST = `${this.BASE_URL}/list`;
  private CREATE_WITH_FILE = `${this.BASE_URL}/create-with-file`;
  private UPDATE_WITH_FILE = `${this.BASE_URL}/update-with-file`;
  private DELETE_FILE = `${this.BASE_URL}/delete-file`;
  private FIND_FILE = `${this.BASE_URL}/file-by-name`;

  constructor(private http: HttpClient) { }

  list(reqObj: any) {
    return this.http.post(this.LIST, reqObj).pipe(map((data: any) => data));
  }
  
  createWithFile(reqObj: any, file: File) {

    let formData = new FormData();
    formData.append('reqObj', JSON.stringify(reqObj));
    formData.append('file', file);

    return this.http.post(this.CREATE_WITH_FILE, formData).pipe(map((data: any) => data));
  }

  updateWithFile(reqObj: any, file: File) {

    let formData = new FormData();
    formData.append('reqObj', JSON.stringify(reqObj));
    formData.append('file', file);

    return this.http.post(this.UPDATE_WITH_FILE, formData).pipe(map((data: any) => data));
  }

  findFile(name: string) {
    let params = new HttpParams().set('fileName', name);
    return this.http.get(this.FIND_FILE, { params }).pipe(map((data: any) => data));
  }

  deletefile(data: string) {
    let params = new HttpParams().set('id', data)
    return this.http.delete(this.DELETE_FILE, { params }).pipe(map((data: any) => data));
  }


}
