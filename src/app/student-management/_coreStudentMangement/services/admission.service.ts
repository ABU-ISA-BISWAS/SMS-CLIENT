import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer'; 
import { StudentAdmission, AdmissionStatusUpdate } from '../models/admission.model';

@Injectable({ providedIn: 'root' })
export class AdmissionService extends ResourceService<StudentAdmission> {
  private BASE = `${environment.baseUrl}${environment.authApiUrl}`;
  private EP   = `api/admission`;

  private SAVE_URL          = `${this.BASE}/${this.EP}/create`;
  private UPDATE_URL        = `${this.BASE}/${this.EP}/update`;
  private UPDATE_STATUS_URL = `${this.BASE}/${this.EP}/update-status`;
  private SINGLE_URL        = `${this.BASE}/${this.EP}/find`;
  private UPLOAD_PHOTO_URL  = `${this.BASE}/${this.EP}/upload-photo`;
  private UPLOAD_DOC_URL    = `${this.BASE}/${this.EP}/upload-document`;
  private DOCS_URL          = `${this.BASE}/${this.EP}/documents`;

  // Dropdown APIs
  private SESSIONS_URL    = `${this.BASE}/api/academic-session/all`;
  private CLASSES_URL     = `${this.BASE}/api/class-master/all`;
  private SECTIONS_URL    = `${this.BASE}/api/section-master/all`;
  private SHIFTS_URL      = `${this.BASE}/api/shift-master/all`;
  private GROUPS_URL      = `${this.BASE}/api/group-version-master/all`;
  private GENDERS_URL     = `${this.BASE}/api/gender-master/all`;
  private RELIGIONS_URL   = `${this.BASE}/api/religion-master/all`;
  private BLOODGROUPS_URL = `${this.BASE}/api/blood-group-master/all`;
  private CATEGORIES_URL  = `${this.BASE}/api/student-category-master/all`;
  private RELATIONS_URL   = `${this.BASE}/api/guardian-relation-master/all`;
  private DOC_TYPES_URL   = `${this.BASE}/api/document-type-master/all`;

  constructor(private http: HttpClient, authService: AuthService) {
    super(http, environment.authApiUrl, 'api/admission',
      new HrBuSerializer(), authService);
  }

  // ── CRUD ───────────────────────────────────────────────
  getSingle(id: any) {
    const params = new HttpParams().append('id', id);
    return this.http.get(this.SINGLE_URL, { params })
      .pipe(map((d: any) => d.obj));
  }

  save(data: any) {
    return this.http.post(this.SAVE_URL, data)
      .pipe(map((d: any) => d));
  }

  override update(data: any) {
    return this.http.put(this.UPDATE_URL, data)
      .pipe(map((d: any) => d));
  }

  updateStatus(data: AdmissionStatusUpdate) {
    return this.http.put(this.UPDATE_STATUS_URL, data)
      .pipe(map((d: any) => d));
  }

  uploadPhoto(studentNo: number, file: File) {
    const fd = new FormData();
    fd.append('studentNo', String(studentNo));
    fd.append('photo', file);
    return this.http.post(this.UPLOAD_PHOTO_URL, fd)
      .pipe(map((d: any) => d));
  }

  uploadDocument(studentNo: number, admissionNo: number,
                 docTypeNo: number, file: File) {
    const fd = new FormData();
    fd.append('studentNo',   String(studentNo));
    fd.append('admissionNo', String(admissionNo));
    fd.append('docTypeNo',   String(docTypeNo));
    fd.append('document',    file);
    return this.http.post(this.UPLOAD_DOC_URL, fd)
      .pipe(map((d: any) => d));
  }

  getDocuments(studentNo: number) {
    const params = new HttpParams().append('studentNo', studentNo);
    return this.http.get(this.DOCS_URL, { params })
      .pipe(map((d: any) => d.obj));
  }

  // ── Dropdowns ──────────────────────────────────────────
  getAllSessions()    { return this.http.get(this.SESSIONS_URL).pipe(map((d: any) => d.obj)); }
  getAllClasses()     { return this.http.get(this.CLASSES_URL).pipe(map((d: any) => d.obj)); }
  getAllSections()    { return this.http.get(this.SECTIONS_URL).pipe(map((d: any) => d.obj)); }
  getAllShifts()      { return this.http.get(this.SHIFTS_URL).pipe(map((d: any) => d.obj)); }
  getAllGroups()      { return this.http.get(this.GROUPS_URL).pipe(map((d: any) => d.obj)); }
  getAllGenders()     { return this.http.get(this.GENDERS_URL).pipe(map((d: any) => d.obj)); }
  getAllReligions()   { return this.http.get(this.RELIGIONS_URL).pipe(map((d: any) => d.obj)); }
  getAllBloodGroups() { return this.http.get(this.BLOODGROUPS_URL).pipe(map((d: any) => d.obj)); }
  getAllCategories()  { return this.http.get(this.CATEGORIES_URL).pipe(map((d: any) => d.obj)); }
  getAllRelations()   { return this.http.get(this.RELATIONS_URL).pipe(map((d: any) => d.obj)); }
  getAllDocTypes()    {
    return this.http.get(this.DOC_TYPES_URL, {
      params: new HttpParams().append('applicableFor', 'STUDENT')
    }).pipe(map((d: any) => d.obj));
  }
}