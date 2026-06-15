import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  photoPreview: string | null = null;
  photoFile: File | null = null;

  // ── Documents ─────────────────────────────────────────
  docEntries: {
    docTypeNo: number | null;
    file: File | null;
    preview: string;
  }[] = [];

  // ── State ─────────────────────────────────────────────
  isLoading = false;
  isSaving = false;
  savedStudentNo: number | null = null;
  savedAdmissionNo: number | null = null;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private authService: AuthService,
    private admissionService: AdmissionService,
    private toastr: ToastrService,
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
          this.initDocEntries();
        },
        error: () => this.toastr.error('Failed to load form data.'),
      });
  }

  initDocEntries() {
    this.docEntries = this.docTypeList.map((dt) => ({
      docTypeNo: dt.id,
      file: null,
      preview: '',
    }));
  }

  // ── Form Open / Close ─────────────────────────────────
  openForm(mode: 'add' | 'edit') {
    if (mode === 'edit') {
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

    if (mode === 'edit' && this.selectedAdmission) {
      this.patchFormData(this.selectedAdmission);
    }

    // destroy DataTable while form is visible
    if (this.admissionTableObj) {
      this.admissionTableObj.destroy();
      this.admissionTableObj = null;
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
    this.savedStudentNo = null;
    this.savedAdmissionNo = null;
    this.currentStep = 1;
  }

  patchFormData(data: any) {
    Object.assign(this.student, data.student || data);
    Object.assign(this.guardian, data.guardian || {});
    Object.assign(this.admission, data);
    if (data.photoPath) this.photoPreview = data.photoPath;
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
          this.savedStudentNo = res.obj?.studentNo;
          this.savedAdmissionNo = res.obj?.admissionNo;

          if (this.photoFile && this.savedStudentNo) {
            this.admissionService
              .uploadPhoto(this.savedStudentNo, this.photoFile)
              .subscribe();
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
    pendingDocs.forEach((doc) => {
      this.admissionService
        .uploadDocument(
          this.savedStudentNo!,
          this.savedAdmissionNo!,
          doc.docTypeNo!,
          doc.file!,
        )
        .subscribe({
          next: () => {
            uploaded++;
            if (uploaded === pendingDocs.length) this.closeForm();
          },
          error: () => {
            uploaded++;
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
    this.router.navigate([
      '/student/admission/profile',
      this.selectedAdmission.admissionNo,
    ]);
  }

  // ── Status Change ─────────────────────────────────────
  changeStatus() {
    if (!this.selectedAdmission) {
      this.toastr.warning('Please select a student first.');
      return;
    }
    // open small modal for status + optional TC fields
    const initialState = {
      title: 'Change Admission Status',
      admission: this.selectedAdmission,
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) this.admissionTableObj?.draw();
    });
  }

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
        url: `${environment.baseUrl}${environment.authApiUrl}/api/admission/gridList`,
        type: 'GET',
        data: (d: any) => {
          d.customSearch = d.search.value;
          d.activeInactiveFlag = that.activeInactiveFlag;
          d.academicSessionNo = that.filterSessionNo || '';
          d.classMasterNo = that.filterClassNo || '';
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
        { title: '#', data: 'admissionNo', width: '50px' },
        {
          title: 'Student',
          data: 'fullName',
          render: (data: string, _: any, row: any) =>
            `<div style="display:flex;align-items:center;gap:8px">
              <div class="adm-avatar">${data.charAt(0).toUpperCase()}</div>
              <div>
                <div style="font-weight:500;font-size:12px">${data}</div>
                <div style="font-size:11px;color:#888">${row.studentCode || ''}</div>
              </div>
            </div>`,
        },
        { title: 'Reg. No', data: 'admissionRegNo', width: '110px' },
        { title: 'Class', data: 'className', width: '90px' },
        { title: 'Section', data: 'sectionName', width: '80px' },
        { title: 'Roll', data: 'rollNo', width: '60px' },
        { title: 'Guardian', data: 'guardianMobile', width: '110px' },
        {
          title: 'Type',
          data: 'admissionType',
          width: '90px',
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
        $('td', row)
          .off('click')
          .on('click', () => {
            if ($(row).hasClass('selected-row')) {
              $(row).removeClass('selected-row');
              this.selectedAdmission = null;
            } else {
              $(row).closest('tbody').find('tr').removeClass('selected-row');
              $(row).addClass('selected-row');
              this.admissionService
                .getSingle(data.admissionNo)
                .subscribe((res: any) => (this.selectedAdmission = res));
            }
          });
        return row;
      },
    });
  }
}
