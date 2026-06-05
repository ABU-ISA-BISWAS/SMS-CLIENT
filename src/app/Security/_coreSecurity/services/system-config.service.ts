import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { SystemConfig } from '../models/system-config.model';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';

@Injectable({
  providedIn: 'root',
})
export class SystemConfigService extends ResourceService<SystemConfig> {
  private END_POINT = `api/system-config`;
  private SAVE_CONFIG = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/create`;
  private UPDATE_CONFIG = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/update`;
  private DELETE_CONFIG = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/delete`;
  private SINGLE_CONFIG = `${environment.baseUrl}${environment.authApiUrl}/${this.END_POINT}/find`;

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'api/system-config',
      new HrBuSerializer(),
      authService,
    );
  }

  getSingleConfig(systemConfigNo: any) {
    console.log('fn', systemConfigNo);
    const params = new HttpParams().append('id', systemConfigNo);
    return this.http
      .get(this.SINGLE_CONFIG, { params })
      .pipe(map((data: any) => data.obj));
  }
  saveConfig(data: any) {
    return this.http
      .post(this.SAVE_CONFIG, data)
      .pipe(map((data: any) => data));
  }
  updateConfig(data: any) {
    return this.http
      .put(this.UPDATE_CONFIG, data)
      .pipe(map((data: any) => data));
  }
  deleteConfig(data: string | number | boolean) {
    const params = new HttpParams().append('id', data);
    return this.http
      .delete(this.DELETE_CONFIG, { params })
      .pipe(map((data: any) => data));
  }
}
