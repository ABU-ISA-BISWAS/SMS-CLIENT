import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
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

    console.log('profile data::::', this.profileData);
    console.log('photoPreview data::::', this.photoPreview);
    this.loadPhoto();
    this.loadDocuments();
  }

  loadPhoto() {
    if (this.admissionNo) {
      this.admissionService.getSingle(this.admissionNo).subscribe({
        next: (res: any) => {
          if (res && res.obj) {
            let studentNo = res.obj.student.studentNo;
            if (studentNo != null && studentNo > 0) {
              this.findStudentPhoto(studentNo);
            }
          }
        },
        error: () => this.toastr.error('Failed to load admission data.'),
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

  loadDocuments() {
    if (!this.admissionData.student.studentNo) return;
    this.admissionService
      .getDocuments(this.admissionData.student.studentNo)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res && res.obj) {
            this.documentList = res?.obj || [];
          }
        },
        error: () => {
          this.isLoading = false;
          this.toastr.error('Failed to load documents.');
        },
      });
  }

  getPhotoUrl(): string {
    const studentNo = this.admissionData.student.studentNo;
    if (!studentNo) return 'assets/images/profile-placeholder.jpg';
    return `${environment.baseUrl}${environment.studentManagementApiUrl}/api/admission/photo/${studentNo}`;
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
    // TC Issue এর জন্য date + reason একটা small modal এ নেব
    // Simple approach: prompt দিয়ে করা যায় অথবা আলাদা modal
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

  downloadDocument(stdDocumentNo: number, fileName: string) {
    const url =
      `${environment.baseUrl}${environment.authApiUrl}` +
      `/api/admission/document/${stdDocumentNo}/download`;
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.target = '_blank';
    a.click();
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
}
