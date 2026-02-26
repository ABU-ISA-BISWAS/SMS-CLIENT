
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'; 
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class BankInfoService {

    private END_POINT = `api/bank-info`;
    private SAVE_BANK_INFO = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/create`;
    private UPDATE_BANK_INFO = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
    private DELETE_BANK_INFO = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/delete`;
    private SINGLE_BANK_INFO = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find`;
    private BANK_ACCOUNT_TYPE_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find-bank-account-type-list`;
    private BANK_INFO_LIST = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/list`;

    constructor(private http: HttpClient) {
    }

    getSingleBankInfo(id: string | number | boolean) {
        const params = new HttpParams().append('id', id);
        return this.http.get(this.SINGLE_BANK_INFO, { params }).pipe(
            map((data: any) => data.obj
            ));
    }

    saveBankInformation(data: any) {
        return this.http.post(this.SAVE_BANK_INFO, data).pipe(
            map((data: any) => data
            ));
    }
    updateBankInformation(data: any) {
        return this.http.put(this.UPDATE_BANK_INFO, data).pipe(
            map((data: any) => data
            ));
    }
    deleteBankInfo(data: string | number | boolean) {
        const params = new HttpParams().append('id', data);
        return this.http.delete(this.DELETE_BANK_INFO, { params }).pipe(
            map((data: any) => data
            ));
    }

    getBankAccDataTypeList(): Observable<any> {
        return this.http.get<any>('./assets/json/bank-acc-type.json').pipe(
            map((data: any) => data
            ));
    }

    findBankAccountTypeList(reqObj: any): Observable<any> {
        return this.http.get<any>(this.BANK_ACCOUNT_TYPE_LIST, reqObj).pipe(
            map((data: any) => data
            ));
    }
    findBankInfoList(reqObj: any): Observable<any> {
        return this.http.get<any>(this.BANK_INFO_LIST, reqObj).pipe(
            map((data: any) => data
            ));
    }


}