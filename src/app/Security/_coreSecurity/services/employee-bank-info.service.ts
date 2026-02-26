import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'; 
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeBankInfoService {

  private END_POINT = `api/employee-bank-info`;
    private SAVE_EMPLOYEE_BANK_INFO = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/create`;
    private UPDATE_EMPLOYEE_BANK_INFO = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
    private UPDATE_FOR_DEFAULT = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/set-default`;

    constructor(private http: HttpClient) {
    }

    saveEmpBankInfo(data: any) {
        return this.http.post(this.SAVE_EMPLOYEE_BANK_INFO, data).pipe(
            map((data: any) => data
            ));
    }

    updateEmpBankInfo(data: any) {
      return this.http.put(this.UPDATE_EMPLOYEE_BANK_INFO, data).pipe(
          map((data: any) => data
          ));
  }
  
  setDefault(id: string | number | boolean,empNo: string | number | boolean) {
    // const params = new HttpParams().append('id', data);
    const params = new HttpParams().set('id', id).set('empNo', empNo);
    return this.http.get(this.UPDATE_FOR_DEFAULT, { params }).pipe(map((data: any) => data));
}
//   setDefault2(id) {
//     // const params = new HttpParams().append('id', data);
//     const params = new HttpParams().set('id', id);
//     return this.http.get(this.UPDATE_FOR_DEFAULT, { params }).pipe(map((data: any) => data));
// }
}
