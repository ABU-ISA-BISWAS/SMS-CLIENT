import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ResourceService } from '../../../auth/_service/resource.service';
import {
  AdmissionStatusUpdate,
  StudentAdmission,
} from '../models/admission.model';
import { HrBuSerializer } from '../serializers/hrm-bu-serializer';

@Injectable({ providedIn: 'root' })
export class AdmissionService extends ResourceService<StudentAdmission> {
  private BASE = `${environment.baseUrl}${environment.authApiUrl}`;
  private BASE_STD_MGNT = `${environment.baseUrl}${environment.studentManagementApiUrl}`;
  private EP = `api/admission`;

  private SAVE_URL = `${this.BASE_STD_MGNT}/${this.EP}/create`;
  private UPDATE_URL = `${this.BASE_STD_MGNT}/${this.EP}/update`;
  private UPDATE_STATUS_URL = `${this.BASE_STD_MGNT}/${this.EP}/update-status`;
  private SINGLE_URL = `${this.BASE_STD_MGNT}/${this.EP}/find`;
  private UPLOAD_PHOTO_URL = `${this.BASE_STD_MGNT}/${this.EP}/upload-photo`;
  private UPLOAD_DOC_URL = `${this.BASE_STD_MGNT}/${this.EP}/upload-document`;
  private DOCS_URL = `${this.BASE_STD_MGNT}/${this.EP}/documents`;
  private FIND_DOCUMENT_URL = `${this.BASE_STD_MGNT}/${this.EP}/find-document`;

  // Dropdown APIs
  private SESSIONS_URL = `${this.BASE}/api/session/all`;
  private CLASSES_URL = `${this.BASE}/api/class/all`;
  private SECTIONS_URL = `${this.BASE}/api/section/all`;
  private SHIFTS_URL = `${this.BASE}/api/shift/all`;
  private GROUPS_URL = `${this.BASE}/api/group-version/all`;
  private GENDERS_URL = `${this.BASE}/api/lookup/gender/all`;
  private RELIGIONS_URL = `${this.BASE}/api/lookup/religion/all`;
  private BLOODGROUPS_URL = `${this.BASE}/api/lookup/blood-grp/all`;
  private CATEGORIES_URL = `${this.BASE}/api/student-category/all`;
  private RELATIONS_URL = `${this.BASE}/api/guardian-relation/all`;
  private DOC_TYPES_URL = `${this.BASE}/api/lookup/doc-type/student`;
  private FIND_STUDETN_PHOTO = `${this.BASE_STD_MGNT}/${this.EP}/find-student-photo`;

  constructor(
    private http: HttpClient,
    authService: AuthService,
  ) {
    super(
      http,
      environment.authApiUrl,
      'api/admission',
      new HrBuSerializer(),
      authService,
    );
  }

  // ── CRUD ───────────────────────────────────────────────
  getSingle(id: any) {
    const params = new HttpParams().append('id', id);
    return this.http.get(this.SINGLE_URL, { params }).pipe(map((d: any) => d));
  }

  save(data: any) {
    return this.http.post(this.SAVE_URL, data).pipe(map((d: any) => d));
  }

  override update(data: any) {
    return this.http.put(this.UPDATE_URL, data).pipe(map((d: any) => d));
  }

  updateStatus(data: AdmissionStatusUpdate) {
    return this.http.put(this.UPDATE_STATUS_URL, data).pipe(map((d: any) => d));
  }

  // admission.service.ts এ
  uploadPhoto(studentNo: number, file: File) {
    const fd = new FormData();
    fd.append('studentNo', String(studentNo));
    fd.append('photo', file);
    return this.http.post(this.UPLOAD_PHOTO_URL, fd).pipe(map((d: any) => d));
  }

  uploadDocument(
    studentNo: number,
    admissionNo: number,
    docTypeNo: number,
    file: File,
  ) {
    const fd = new FormData();
    fd.append('studentNo', String(studentNo));
    fd.append('admissionNo', String(admissionNo));
    fd.append('docTypeNo', String(docTypeNo));
    fd.append('document', file);
    return this.http.post(this.UPLOAD_DOC_URL, fd).pipe(map((d: any) => d));
  }

  getDocuments(studentNo: any) {
    const params = new HttpParams().append('studentNo', studentNo);
    return this.http
      .get<any>(this.DOCS_URL, { params })
      .pipe(map((d: any) => d));
  }

  findDocument(data: any) {
    return this.http
      .post(this.FIND_DOCUMENT_URL, data)
      .pipe(map((d: any) => d));
  }

  // ── Dropdowns ──────────────────────────────────────────
  getAllSessions() {
    return this.http.get(this.SESSIONS_URL).pipe(map((d: any) => d));
  }
  getAllClasses() {
    return this.http.get(this.CLASSES_URL).pipe(map((d: any) => d));
  }
  getAllSections() {
    return this.http.get(this.SECTIONS_URL).pipe(map((d: any) => d));
  }
  getAllShifts() {
    return this.http.get(this.SHIFTS_URL).pipe(map((d: any) => d));
  }
  getAllGroups() {
    return this.http.get(this.GROUPS_URL).pipe(map((d: any) => d));
  }
  getAllGenders() {
    return this.http.get(this.GENDERS_URL).pipe(map((d: any) => d));
  }
  getAllReligions() {
    return this.http.get(this.RELIGIONS_URL).pipe(map((d: any) => d));
  }
  getAllBloodGroups() {
    return this.http.get(this.BLOODGROUPS_URL).pipe(map((d: any) => d));
  }
  getAllCategories() {
    return this.http.get(this.CATEGORIES_URL).pipe(map((d: any) => d));
  }
  getAllRelations() {
    return this.http.get(this.RELATIONS_URL).pipe(map((d: any) => d));
  }
  getAllDocTypes() {
    return this.http
      .get(this.DOC_TYPES_URL, {
        params: new HttpParams().append('applicableFor', 'STUDENT'),
      })
      .pipe(map((d: any) => d));
  }

  findStudentPhoto(data: any) {
    const params = new HttpParams().append('studentNo', data);
    return this.http.get<any>(this.FIND_STUDETN_PHOTO, { params });
  }
}
