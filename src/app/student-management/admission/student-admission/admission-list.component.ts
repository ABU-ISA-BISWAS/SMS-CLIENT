import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { StudentAdmission } from '../../_coreStudentMangement/models/admission.model';
import { StudentGuardian } from '../../_coreStudentMangement/models/guardian.model';
import { StudentMaster } from '../../_coreStudentMangement/models/student.model';
import { AdmissionService } from '../../_coreStudentMangement/services/admission.service';

@Component({
  selector: 'app-admission-list',
  templateUrl: './admission-list.component.html',
  styleUrls: ['./admission-list.component.css'],
  standalone: false,
})
export class AdmissionListComponent implements OnInit, AfterViewInit {
  @ViewChild('admissionGrid') admissionGrid!: ElementRef;

  bsModalRef!: BsModalRef;

  // ── Grid ──────────────────────────────────────────────
  admissionTable: any;
  admissionTableObj: any;
  selectedAdmission: any = null;
  admissionNo: any;
  selectedStudent: any;

  // ── Filter ────────────────────────────────────────────
  sessionList: any[] = [];
  classList: any[] = [];
  filterSessionNo: number | null = null;
  filterClassNo: number | null = null;
  filterAdmissionStatus: string | null = null;
  activeInactiveFlag = 'A';

  // ── View Toggle ───────────────────────────────────────
  isFormVisible = false;
  formMode: 'add' | 'edit' = 'add';

  // ── Step ──────────────────────────────────────────────
  currentStep = 1;
  totalSteps = 4;
  steps = [
    { no: 1, label: 'Personal' },
    { no: 2, label: 'Guardian' },
    { no: 3, label: 'Admission' },
    { no: 4, label: 'Documents' },
  ];

  // ── Form Data ─────────────────────────────────────────
  student = new StudentMaster();
  guardian = new StudentGuardian();
  admission = new StudentAdmission();

  // ── Dropdowns ─────────────────────────────────────────
  genderList: any[] = [];
  religionList: any[] = [];
  bloodGroupList: any[] = [];
  categoryList: any[] = [];
  relationList: any[] = [];
  sectionList: any[] = [];
  shiftList: any[] = [];
  groupList: any[] = [];
  docTypeList: any[] = [];

  // ── Photo ─────────────────────────────────────────────
  photoPreview: any = null;
  photoFile: File | null = null;

  // ── Documents ─────────────────────────────────────────
  docEntries: {
    docTypeNo: number | null;
    docTypeName: String | null;
    file: File | null;
    preview: string;
  }[] = [];

  savedDocuments: any[] = [];
  isDocumentsLoading = false;

  // ── State ─────────────────────────────────────────────
  isLoading = false;
  isSaving = false;
  savedStudentNo: number | null = null;
  savedAdmissionNo: number | null = null;

  previewImageUrl: SafeResourceUrl | null = null;
  previewImageName = '';

  isStatusUpdating = false;

  statusOptions = [
    { value: 'ACTIVE', label: 'Active', cls: 'status-active' },
    { value: 'TC_ISSUED', label: 'TC Issued', cls: 'status-tc' },
    { value: 'PASSED_OUT', label: 'Passed Out', cls: 'status-passed' },
    { value: 'DROPOUT', label: 'Dropout', cls: 'status-dropout' },
    { value: 'EXPELLED', label: 'Expelled', cls: 'status-exp' },
  ];

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private authService: AuthService,
    private admissionService: AdmissionService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.loadFilterDropdowns();
  }

  ngAfterViewInit(): void {
    this.initGrid();
  }

  // ── Dropdowns ─────────────────────────────────────────
  loadFilterDropdowns() {
    this.admissionService.getAllSessions().subscribe({
      next: (res: any) => (this.sessionList = res.items || []),
    });
    this.admissionService.getAllClasses().subscribe({
      next: (res: any) => (this.classList = res.items || []),
    });
  }

  loadFormDropdowns() {
    this.isLoading = true;
    forkJoin({
      genders: this.admissionService.getAllGenders(),
      religions: this.admissionService.getAllReligions(),
      bloodGroups: this.admissionService.getAllBloodGroups(),
      categories: this.admissionService.getAllCategories(),
      relations: this.admissionService.getAllRelations(),
      shifts: this.admissionService.getAllShifts(),
      groups: this.admissionService.getAllGroups(),
      docTypes: this.admissionService.getAllDocTypes(),
      sections: this.admissionService.getAllSections(),
    })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          console.log('dataaa:::', res.genders.items);
          this.genderList = res.genders.items || [];
          this.religionList = res.religions.items || [];
          this.bloodGroupList = res.bloodGroups.items || [];
          this.categoryList = res.categories.items || [];
          this.relationList = res.relations.items || [];
          this.shiftList = res.shifts.items || [];
          this.groupList = res.groups.items || [];
          this.docTypeList = res.docTypes.items || [];
          this.sectionList = res.sections.items || [];
          this.initDocEntries();
        },
        error: () => this.toastr.error('Failed to load form data.'),
      });
  }

  initDocEntries() {
    this.docEntries = this.docTypeList.map((dt) => ({
      docTypeNo: dt.id,
      docTypeName: dt.docTypeName,
      file: null,
      preview: '',
    }));
  }

  // ── Form Open / Close ─────────────────────────────────
  openForm(mode: 'add' | 'edit') {
    if (mode === 'edit') {
      this.admissionNo = this.selectedAdmission.admission.admissionNo;
      console.log(
        'response:::::',
        this.selectedAdmission.admission.admissionNo,
      );
      if (!this.selectedAdmission) {
        this.toastr.warning('Please select a record to Edit.');
        return;
      }
    }

    this.formMode = mode;
    this.currentStep = 1;
    this.resetFormData();
    this.isFormVisible = true;
    this.loadFormDropdowns();

    if (mode === 'edit') {
      this.admissionService.getSingle(this.admissionNo).subscribe({
        next: (res: any) => {
          if (res && res.obj) {
            const studentNo = res.obj.student?.studentNo;
            const admissionNo = res.obj.admission?.admissionNo;
            this.savedAdmissionNo = admissionNo;
            this.savedStudentNo = studentNo;

            if (studentNo && admissionNo) {
              this.findStudentPhoto(studentNo);
              this.loadSavedDocuments(studentNo, admissionNo);
            }
            this.patchFormData(res.obj);
          }
        },
        error: () => this.toastr.error('Failed to load admission data.'),
      });
    }

    if (this.admissionTableObj) {
      this.admissionTableObj.destroy();
      this.admissionTableObj = null;
    }
  }

  loadSavedDocuments(studentNo: number, admissionNo: number) {
    this.isDocumentsLoading = true;
    this.savedDocuments = [];

    // Step 1: Document metadata list আনুন
    this.admissionService.getDocuments(studentNo).subscribe({
      next: (res: any) => {
        const docList: any[] = res?.items || [];

        if (docList.length === 0) {
          this.isDocumentsLoading = false;
          return;
        }

        // Step 2: প্রতিটি document এর BLOB আনুন
        let loadedCount = 0;
        const enrichedDocs: any[] = [];

        docList.forEach((doc: any) => {
          const data = {
            stdDocumentNo: doc.stdDocumentNo,
            studentNo: studentNo,
            admissionNo: admissionNo,
          };
          this.admissionService.findDocument(data).subscribe({
            next: (docRes: any) => {
              loadedCount++;
              const obj = docRes?.obj;
              const mimeType = this.getMimeType(doc.fileType);

              enrichedDocs.push({
                ...doc,
                base64: obj?.base64 || null,
                mimeType: mimeType,
                dataUrl: obj?.base64
                  ? this.sanitizer.bypassSecurityTrustResourceUrl(
                      `data:${mimeType};base64,${obj.base64}`,
                    )
                  : null,
              });

              // সব load হলে sort করে assign করুন
              if (loadedCount === docList.length) {
                this.savedDocuments = enrichedDocs.sort(
                  (a, b) => a.stdDocumentNo - b.stdDocumentNo,
                );
                this.isDocumentsLoading = false;
              }
            },
            error: () => {
              loadedCount++;
              enrichedDocs.push({ ...doc, base64: null, dataUrl: null });
              if (loadedCount === docList.length) {
                this.savedDocuments = enrichedDocs;
                this.isDocumentsLoading = false;
              }
            },
          });
        });
      },
      error: () => {
        this.isDocumentsLoading = false;
        this.toastr.error('Failed to load documents.');
      },
    });
  }

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

  closeForm() {
    this.isFormVisible = false;
    this.resetFormData();
    // re-init grid
    setTimeout(() => this.initGrid(), 50);
  }

  resetFormData() {
    this.student = new StudentMaster();
    this.guardian = new StudentGuardian();
    this.admission = new StudentAdmission();
    this.photoPreview = null;
    this.photoFile = null;
    this.docEntries = [];
    this.savedDocuments = [];
    this.isDocumentsLoading = false;
    this.savedStudentNo = null;
    this.savedAdmissionNo = null;
    this.currentStep = 1;
  }
  patchFormData(data: any) {
    // API response এ student / guardian / admission আলাদা object আসছে
    const s = data.student || {};
    const g = data.guardian || {};
    const a = data.admission || {};

    // Student — numeric FK গুলো সরাসরি patch হবে
    Object.assign(this.student, {
      studentNo: s.studentNo,
      studentCode: s.studentCode,
      fullName: s.fullName,
      fullNameBn: s.fullNameBn,
      dateOfBirth: s.dateOfBirth,
      genderNo: s.genderNo, // ← number → ng-select bind হবে
      religionNo: s.religionNo, // ← number
      bloodGroupNo: s.bloodGroupNo, // ← number
      studentCategoryNo: s.studentCategoryNo, // ← number
      nationality: s.nationality,
      birthCertNo: s.birthCertNo,
      nidNo: s.nidNo,
      mobileNo: s.mobileNo,
      email: s.email,
      presentAddress: s.presentAddress,
      permanentAddress: s.permanentAddress,
    });

    Object.assign(this.guardian, {
      guardianNo: g.guardianNo,
      studentNo: s.studentNo,
      relationNo: g.relationNo, // ← number → ng-select bind হবে
      guardianName: g.guardianName,
      guardianNameBn: g.guardianNameBn,
      occupation: g.occupation,
      mobileNo: g.mobileNo,
      email: g.email,
      nidNo: g.nidNo,
      annualIncome: g.annualIncome,
      isPrimary: 1,
    });

    // Admission
    Object.assign(this.admission, {
      admissionNo: a.admissionNo,
      admissionRegNo: a.admissionRegNo,
      studentNo: s.studentNo,
      academicSessionNo: a.academicSessionNo, // ← number
      classMasterNo: a.classMasterNo, // ← number
      sectionMasterNo: a.sectionMasterNo, // ← number
      shiftMasterNo: a.shiftMasterNo, // ← number
      groupVersionNo: a.groupVersionNo, // ← number
      rollNo: a.rollNo,
      admissionDate: a.admissionDate,
      admissionType: a.admissionType,
      admissionStatus: a.admissionStatus,
      prevSchool: a.prevSchool,
      prevClass: a.prevClass,
      prevRoll: a.prevRoll,
      remarks: a.remarks,
    });
  }

  // ── Step Navigation ───────────────────────────────────
  goToStep(step: number) {
    if (step > this.currentStep && !this.validateCurrentStep()) return;
    this.currentStep = step;
  }

  nextStep() {
    if (!this.validateCurrentStep()) return;
    if (this.currentStep === 3) {
      this.saveAdmission();
      return;
    }
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  validateCurrentStep(): boolean {
    if (this.currentStep === 1) {
      if (!this.student.fullName) {
        this.toastr.warning("Student full name can't be empty!");
        return false;
      }
      if (!this.student.dateOfBirth) {
        this.toastr.warning("Date of birth can't be empty!");
        return false;
      }
      if (!this.student.genderNo) {
        this.toastr.warning("Gender can't be empty!");
        return false;
      }
    }
    if (this.currentStep === 2) {
      if (!this.guardian.guardianName) {
        this.toastr.warning("Guardian name can't be empty!");
        return false;
      }
      if (!this.guardian.mobileNo) {
        this.toastr.warning("Guardian mobile can't be empty!");
        return false;
      }
      if (!this.guardian.relationNo) {
        this.toastr.warning("Guardian relation can't be empty!");
        return false;
      }
    }
    if (this.currentStep === 3) {
      if (!this.admission.academicSessionNo) {
        this.toastr.warning("Session can't be empty!");
        return false;
      }
      if (!this.admission.classMasterNo) {
        this.toastr.warning("Class can't be empty!");
        return false;
      }
    }
    return true;
  }

  // ── Class change ──────────────────────────────────────
  onClassChange(classId: number) {
    this.admission.sectionMasterNo = undefined as any;
    this.sectionList = [];
    if (!classId) return;
    this.admissionService.getAllSections().subscribe({
      next: (res: any) => (this.sectionList = res.items || []),
    });
  }

  // ── Photo ─────────────────────────────────────────────
  onPhotoChange(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      this.toastr.warning('Photo must be less than 2MB.');
      return;
    }
    this.photoFile = file;
    const reader = new FileReader();
    reader.onload = () => (this.photoPreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  clearPhoto() {
    this.photoFile = null;
    this.photoPreview = null;
  }

  // ── Documents ─────────────────────────────────────────
  onDocFileChange(event: any, index: number) {
    const file: File = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      this.toastr.warning('File must be less than 5MB.');
      return;
    }
    this.docEntries[index].file = file;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () =>
        (this.docEntries[index].preview = reader.result as string);
      reader.readAsDataURL(file);
    } else {
      this.docEntries[index].preview = 'pdf';
    }
  }

  removeDoc(index: number) {
    this.docEntries[index].file = null;
    this.docEntries[index].preview = '';
  }

  // ── Save ──────────────────────────────────────────────
  saveAdmission() {
    this.isSaving = true;
    const payload = {
      student: this.student,
      guardian: this.guardian,
      admission: this.admission,
    };

    const req$ =
      this.formMode === 'edit'
        ? this.admissionService.update(payload)
        : this.admissionService.save(payload);

    req$.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.savedAdmissionNo = res.obj?.admissionNo;
          this.savedStudentNo = res.obj?.studentNo;

          if (this.photoFile && this.savedStudentNo) {
            this.admissionService
              .uploadPhoto(this.savedStudentNo, this.photoFile)
              .subscribe({
                next: (res) => {
                  if (!res) {
                    this.toastr.error('Document upload failed.');
                    return;
                  }
                  if (res.success) {
                    this.toastr.success(
                      res.message || 'Document uploaded successfully',
                    );
                  } else {
                    this.toastr.warning(
                      res.message || 'Document upload failed.',
                    );
                  }
                },
                error: (err) => {
                  const message =
                    err?.error?.message ||
                    err?.error?.errorMessage ||
                    'Photo upload failed';
                  this.toastr.error(message);
                },
              });
          }

          this.currentStep = 4;
          this.toastr.success(res.message || 'Admission saved successfully!');
        } else {
          this.toastr.warning(res.message || 'Save failed.');
        }
      },
      error: () => this.toastr.error('Something went wrong. Please try again.'),
    });
  }

  finishAndClose() {
    const pendingDocs = this.docEntries.filter((d) => d.file && d.docTypeNo);

    if (pendingDocs.length === 0) {
      this.closeForm();
      return;
    }

    let uploaded = 0;
    let failedCount = 0;

    pendingDocs.forEach((doc) => {
      this.admissionService
        .uploadDocument(
          this.savedStudentNo!,
          this.savedAdmissionNo!,
          doc.docTypeNo!,
          doc.file!,
        )
        .subscribe({
          next: (res: any) => {
            uploaded++;
            if (res.success && res.obj) {
              this.savedDocuments.push({
                stdDocumentNo: res.obj.stdDocumentNo,
                docTypeName: doc.docTypeName || '',
                fileName: doc.file!.name,
                fileType: doc.file!.name.split('.').pop()?.toUpperCase(),
                isVerified: 0,
              });
            } else {
              failedCount++;
              this.toastr.warning(
                res.message || `Failed to upload "${doc.docTypeName}".`,
              );
            }
            if (uploaded === pendingDocs.length) {
              if (failedCount === 0) {
                this.toastr.success('All documents uploaded successfully!');
              }
              this.closeForm();
            }
          },
          error: (err) => {
            uploaded++;
            failedCount++;
            const message =
              err?.error?.message ||
              err?.error?.errorMessage ||
              `Failed to upload "${doc.docTypeName}".`;
            this.toastr.error(message);
            if (uploaded === pendingDocs.length) this.closeForm();
          },
        });
    });
  }

  // ── Profile ───────────────────────────────────────────
  viewProfile() {
    if (!this.selectedAdmission) {
      this.toastr.warning('Please select a student first.');
      return;
    }

    this.router.navigate(
      [
        'student-management/student/admission/profile',
        this.selectedAdmission.admission.admissionNo,
      ],
      {
        state: {
          studentData: this.selectedStudent,
          admissionData: this.selectedAdmission,
        },
      },
    );
  }
  // ── Status Change ─────────────────────────────────────

  // ── Filter ────────────────────────────────────────────
  applyFilter() {
    this.admissionTableObj?.draw();
  }
  clearFilter() {
    this.filterSessionNo = null;
    this.filterClassNo = null;
    this.filterAdmissionStatus = null;
    this.admissionTableObj?.draw();
  }
  statusCheck(s: string) {
    this.activeInactiveFlag = s;
    this.admissionTableObj?.draw();
  }

  // ── DataTable ─────────────────────────────────────────
  initGrid() {
    const that = this;
    if (!this.admissionGrid?.nativeElement) return;

    this.admissionTableObj = $(this.admissionGrid.nativeElement).DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url: `${environment.baseUrl}${environment.studentManagementApiUrl}/api/admission/gridList`,
        type: 'GET',
        data: (d: any) => {
          d.customSearch = d.search.value;
          d.academicSession = that.filterSessionNo || '';
          d.classMaster = that.filterClassNo || '';
          d.admissionStatus = that.filterAdmissionStatus || '';
          return d;
        },
        beforeSend: (xhr: any) => {
          xhr.setRequestHeader(
            'Authorization',
            'bearer ' + that.authService.getAccessToken(),
          );
          xhr.setRequestHeader('Content-Type', 'application/json');
        },
        dataSrc: (response: any) => {
          response.draw = response.obj.draw;
          response.recordsTotal = response.obj.recordsTotal;
          response.recordsFiltered = response.obj.recordsFiltered;
          return response.obj.data;
        },
        error: (req: any) => console.error('Grid Error', req.responseText),
      },
      order: [[0, 'desc']],
      columns: [
        { title: '#', data: 'admissionNo', width: '30px' },
        // grid columns এ Employee cell এ photo URL ব্যবহার করুন
        // {title: 'Student Name', data: 'fullName',width: '150px',},
        // { title: 'Reg. No', data: 'admissionRegNo', width: '120px' },
        {
          title: 'Student Name',
          data: null,
          width: '200px',
          render: function (data, type, row) {
            return `
      <div>
        <div><strong>Name:</strong> ${row.fullName || ''}</div>
        <div><strong>Reg No:</strong> ${row.admissionRegNo || ''}</div>
      </div>
    `;
          },
        },
        { title: 'Class', data: 'className', width: '120px' },
        { title: 'Section', data: 'sectionName', width: '120px' },
        { title: 'Roll', data: 'rollNo', width: '60px', className: 'dt-left' },
        {
          title: 'Guardian Mobile',
          data: 'guardianMobile',
          width: '120px',
          className: 'dt-left',
        },
        {
          title: 'Ad. Type',
          data: 'admissionType',
          width: '80px',
          render: (data: string) => {
            const m: any = {
              NEW: 'adm-tag-new',
              TRANSFER: 'adm-tag-tr',
              RE_ADMISSION: 'adm-tag-re',
            };
            return `<span class="adm-tag ${m[data] || ''}">${data}</span>`;
          },
        },
        {
          title: 'Status',
          data: 'admissionStatus',
          width: '90px',
          render: (data: string) => {
            const m: any = {
              ACTIVE: 'adm-status-active',
              TC_ISSUED: 'adm-status-tc',
              PASSED_OUT: 'adm-status-passed',
              DROPOUT: 'adm-status-drop',
              EXPELLED: 'adm-status-exp',
            };
            const l: any = {
              ACTIVE: 'Active',
              TC_ISSUED: 'TC Issued',
              PASSED_OUT: 'Passed Out',
              DROPOUT: 'Dropout',
              EXPELLED: 'Expelled',
            };
            return `<span class="adm-status ${m[data] || ''}">${l[data] || data}</span>`;
          },
        },
      ],
      autoWidth: false,
      rowCallback: (row: Node, data: any) => {
        const self = this;

        $('td', row).off('click');
        $('td', row).on('click', () => {
          console.log('dataaa::', data);
          self.selectedStudent = data;
          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');
            this.selectedAdmission = null;
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
            this.admissionService
              .getSingle(data.admissionNo)
              .subscribe((res: any) => (this.selectedAdmission = res.obj));
          }
        });
        return row;
      },
    });
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

  changeStatus(newStatus: string) {
    const currentStatus = this.selectedAdmission?.admissionStatus;
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
      admissionNo: this.selectedStudent.admissionNo,
      admissionStatus: status,
      tcDate: tcDate || '',
      tcReason: tcReason || '',
    };
    this.admissionService.updateStatus(payload).subscribe({
      next: (res: any) => {
        this.isStatusUpdating = false;
        if (res.success) {
          this.toastr.success(res.message || 'Status updated!');
          this.admissionTableObj?.draw();
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

  // Image preview lightbox

  previewImage(dataUrl: SafeResourceUrl, fileName: string) {
    this.previewImageUrl = dataUrl;
    this.previewImageName = fileName;
  }

  closePreview() {
    this.previewImageUrl = null;
    this.previewImageName = '';
  }

  deleteDoc(doc: any) {
    // confirmation modal চাইলে ConfirmationDialog ব্যবহার করতে পারেন,
    // আপাতত simple confirm দিয়ে দেখাচ্ছি
    // if (!confirm(`Delete document "${doc.docTypeName}"?`)) return;

    const initialState = { title: `Delete document "${doc.docTypeName}"?` };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: '',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.admissionService.deleteDocument(doc.stdDocumentNo).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.savedDocuments = this.savedDocuments.filter(
                (d) => d.stdDocumentNo !== doc.stdDocumentNo,
              );
              this.toastr.success(res.message || 'Document deleted.');
            } else {
              this.toastr.warning(res.message || 'Failed to delete document.');
            }
          },
          error: (err) => {
            const message =
              err?.error?.message ||
              err?.error?.errorMessage ||
              'Failed to delete document.';
            this.toastr.error(message);
          },
        });
      }
    });
  }
}
