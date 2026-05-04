import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LicenseService {
  private END_POINT = `${environment.baseUrl}${environment.freeAuthApiUrl}/licensing`;

  private FIND_LICENSE_VALIDATION = `${this.END_POINT}/validation`;

  constructor(private http: HttpClient) {}

  private serviceLevelCache: {
    value: { valid: number; message: string };
    expiresAt: number;
  } | null = null;

  findLicenseValidation(param: any): Observable<any> {
    return this.http
      .post<any>(this.FIND_LICENSE_VALIDATION, param)
      .pipe(map((data: any) => data));
  }

  ////////////////////////non api/////////////////////////////
  private cacheKey = 'licenseStatus';

  private saveCache(status: { valid: number; message?: string }) {
    const expiryTime = 1 * 60 * 60 * 1000; // 1 hours in ms
    const record = {
      value: status,
      expiresAt: Date.now() + expiryTime,
    };

    localStorage.setItem(this.cacheKey, JSON.stringify(record));
  }

  loadCache(): { valid: number; message?: string } | null {
    const raw = localStorage.getItem(this.cacheKey);
    if (!raw) return null;

    const record = JSON.parse(raw);
    if (Date.now() > record.expiresAt) {
      localStorage.removeItem(this.cacheKey); // cleanup expired
      return null;
    }

    return record.value;
  }
  private saveServiceCache(status: { valid: number; message?: string }) {
    const expiryTime = 1 * 60 * 60 * 1000; // 1 hours in ms
    const serviceLevelCache = {
      value: status,
      expiresAt: Date.now() + expiryTime,
    };
  }

  loadServiceCache(): { valid: number; message?: string } | null {
    if (!this.serviceLevelCache) return null;

    if (Date.now() > this.serviceLevelCache.expiresAt) {
      this.serviceLevelCache = null; // expired, clear cache
      return null;
    }

    return this.serviceLevelCache.value;
  }

  /**
   * Main license check with cache
   */
  validateLicense(
    force = false,
  ): Observable<{ message?: string; actionFlag: number }> {
    //const cached = this.loadCache();
    const cached = this.loadServiceCache();
    if (!force && cached) {
      // return cached as observable
      return of({ message: cached.message, actionFlag: cached.valid });
    }

    // API call
    return this.http.post<any>(this.FIND_LICENSE_VALIDATION, {}).pipe(
      map((response) => {
        const status = {
          valid: response.actionFlag,
          message: response.message,
        };
        this.saveCache(status);
        this.saveServiceCache(status);
        return { message: response.message, actionFlag: response.actionFlag };
      }),
    );
  }
}
