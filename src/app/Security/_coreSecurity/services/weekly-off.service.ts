import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WeeklyOffService {
  private BASE = `${environment.baseUrl}${environment.authApiUrl}`;
  private EP = 'api/weekly-off';

  private GET_URL = `${this.BASE}/${this.EP}/all`;
  private SAVE_URL = `${this.BASE}/${this.EP}/create`;

  constructor(private http: HttpClient) {}

  getWeeklyOff() {
    return this.http.get(this.GET_URL).pipe(map((d: any) => d));
  }

  saveWeeklyOff(data: any) {
    return this.http.post(this.SAVE_URL, data).pipe(map((d: any) => d));
  }
}
