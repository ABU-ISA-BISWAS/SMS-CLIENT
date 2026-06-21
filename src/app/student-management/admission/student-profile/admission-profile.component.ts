import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { AdmissionService } from '../../_coreStudentMangement/services/admission.service';

@Component({
  selector: 'app-admission-profile',
  templateUrl: './admission-profile.component.html',
  styleUrls: ['./admission-profile.component.css'],
  standalone: false,
})
export class AdmissionProfileComponent implements OnInit {
  bsModalRef!: BsModalRef;

  admissionNo!: number;
  profileData!: any;
  photoPreview!: any;
  admissionData!: any;
  documentList: any[] = [];

  isLoading = true;
  isStatusUpdating = false;
  isDocumentsLoading = false;

  // Status change
  activeTab: 'info' | 'documents' = 'info';

  statusOptions = [
    { value: 'ACTIVE', label: 'Active', cls: 'status-active' },
    { value: 'TC_ISSUED', label: 'TC Issued', cls: 'status-tc' },
    { value: 'PASSED_OUT', label: 'Passed Out', cls: 'status-passed' },
    { value: 'DROPOUT', label: 'Dropout', cls: 'status-dropout' },
    { value: 'EXPELLED', label: 'Expelled', cls: 'status-exp' },
  ];

  admissionTypeLabels: any = {
    NEW: 'New Admission',
    TRANSFER: 'Transfer',
    RE_ADMISSION: 'Re-Admission',
  };

  photoBase64: SafeResourceUrl | null = null;

  previewImageUrl: SafeResourceUrl | null = null;
  previewImageName = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private admissionService: AdmissionService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.admissionNo = Number(this.route.snapshot.paramMap.get('id'));
    this.profileData = history.state.studentData;
    this.admissionData = history.state.admissionData;

    if (
      !this.profileData ||
      !this.admissionData.student.studentNo ||
      !this.profileData?.admissionNo
    ) {
      console.error('Profile/Admission data missing — cannot load documents', {
        profileData: this.profileData,
        admissionData: this.admissionData,
      });
      this.toastr.error(
        'Profile/Admission data missing — cannot load documents',
      );
      this.isLoading = false;
      return;
    }

    this.loadPhoto();
  }

  loadPhoto() {
    this.isLoading = true;
    if (this.admissionNo) {
      this.admissionService.getSingle(this.admissionNo).subscribe({
        next: (res: any) => {
          if (res && res.obj) {
            this.isLoading = false;
            let studentNo = res.obj.student.studentNo;
            let admissionNo = res.obj.admission.admissionNo;
            if (studentNo && admissionNo) {
              this.findStudentPhoto(studentNo);
              this.loadDocuments(studentNo, admissionNo);
            }
          }
        },
        error: () => {
          this.isLoading = false;
          this.toastr.error('Failed to load admission data.');
        },
      });
    }
  }

  findStudentPhoto(studentNo: any) {
    this.admissionService.findStudentPhoto(studentNo).subscribe(
      (res) => {
        if (res.success) {
          this.photoPreview =
            res.obj != null
              ? this.sanitizer.bypassSecurityTrustResourceUrl(
                  'data:image/*;base64,' + res.obj,
                )
              : null;
        }
      },
      (err) => {
        console.log(' Error ', err);
      },
    );
  }

  // ── Load Documents (metadata + BLOB) ─────────────────
  loadDocuments(studentNo: number, admissionNo: number) {
    this.isDocumentsLoading = true;
    this.documentList = [];

    this.admissionService.getDocuments(studentNo).subscribe({
      next: (res: any) => {
        const docList: any[] = res?.items || [];

        if (docList.length === 0) {
          this.isDocumentsLoading = false;
          return;
        }

        const enrichedList: any[] = [];

        docList.forEach((doc: any) => {
          const mimeType = this.getMimeType(doc.fileType);

          enrichedList.push({
            ...doc,
            mimeType,
            base64: doc?.documentBase64 || null,
            dataUrl: doc?.documentBase64
              ? this.sanitizer.bypassSecurityTrustResourceUrl(
                  `data:${mimeType};base64,${doc.documentBase64}`,
                )
              : null,
          });
        });
        this.documentList = enrichedList;
        this.isDocumentsLoading = false;
      },
      error: () => {
        this.isDocumentsLoading = false;
        this.toastr.error('Failed to load documents.');
      },
    });
  }

  // ── View Image (lightbox) ─────────────────────────────
  viewImage(dataUrl: SafeResourceUrl, fileName: string) {
    this.previewImageUrl = dataUrl;
    this.previewImageName = fileName;
  }

  closePreview() {
    this.previewImageUrl = null;
    this.previewImageName = '';
  }

  // ── View PDF (new tab) ────────────────────────────────
  viewPdf(base64: string, fileName: string) {
    const byteChars = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteChars.length; offset += 512) {
      const slice = byteChars.slice(offset, offset + 512);
      const byteNums = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNums[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNums));
    }
    const blob = new Blob(byteArrays, { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  }

  getStatusClass(status: string): string {
    const map: any = {
      ACTIVE: 'status-active',
      TC_ISSUED: 'status-tc',
      PASSED_OUT: 'status-passed',
      DROPOUT: 'status-dropout',
      EXPELLED: 'status-exp',
    };
    return map[status] || 'status-active';
  }

  getStatusLabel(status: string): string {
    const map: any = {
      ACTIVE: 'Active',
      TC_ISSUED: 'TC Issued',
      PASSED_OUT: 'Passed Out',
      DROPOUT: 'Dropout',
      EXPELLED: 'Expelled',
    };
    return map[status] || status;
  }

  changeStatus(newStatus: string) {
    const currentStatus = this.admissionData?.admissionStatus;
    if (newStatus === currentStatus) return;

    if (newStatus === 'TC_ISSUED') {
      this.openTcModal(newStatus);
      return;
    }

    const initialState = {
      title: `Change status to "${this.getStatusLabel(newStatus)}"?`,
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: '',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.callUpdateStatus(newStatus, null, null);
      }
    });
  }

  openTcModal(status: string) {
    const tcDate = window.prompt(
      'Enter TC Date (YYYY-MM-DD):',
      new Date().toISOString().split('T')[0],
    );
    if (!tcDate) return;

    const tcReason = window.prompt('Enter TC Reason:') || '';
    this.callUpdateStatus(status, tcDate, tcReason);
  }

  callUpdateStatus(
    status: string,
    tcDate: string | null,
    tcReason: string | null,
  ) {
    this.isStatusUpdating = true;
    const payload = {
      admissionNo: this.admissionNo,
      admissionStatus: status,
      tcDate: tcDate || '',
      tcReason: tcReason || '',
    };
    this.admissionService.updateStatus(payload).subscribe({
      next: (res: any) => {
        this.isStatusUpdating = false;
        if (res.success) {
          this.toastr.success(res.message || 'Status updated!');
        } else {
          this.toastr.warning(res.message || 'Failed to update status.');
        }
      },
      error: () => {
        this.isStatusUpdating = false;
        this.toastr.error('Something went wrong.');
      },
    });
  }

  // ── Download (Base64 → file) ──────────────────────────
  downloadDocument(doc: any) {
    if (!doc.base64) {
      this.toastr.warning('File not available for download.');
      return;
    }

    const byteChars = atob(doc.base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteChars.length; offset += 512) {
      const slice = byteChars.slice(offset, offset + 512);
      const byteNums = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNums[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNums));
    }

    const blob = new Blob(byteArrays, { type: doc.mimeType });
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = doc.fileName;
    a.click();

    // Memory cleanup
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  }

  get initials(): string {
    const name = this.admissionData.student?.fullName || '';
    return name
      .split(' ')
      .slice(0, 2)
      .map((w: string) => w.charAt(0).toUpperCase())
      .join('');
  }

  closeForm() {
    this.router.navigate(['student-management/admission/admission-list']);
  }

  // ── Helpers ───────────────────────────────────────────
  getMimeType(fileType: string): string {
    switch ((fileType || '').toUpperCase()) {
      case 'PDF':
        return 'application/pdf';
      case 'JPG':
      case 'JPEG':
        return 'image/jpeg';
      case 'PNG':
        return 'image/png';
      default:
        return 'application/octet-stream';
    }
  }

  goBack() {
    this.router.navigate(['/student/admission']);
  }
}
