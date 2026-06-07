import {
  Component, OnInit, Input, Output, EventEmitter
} from '@angular/core';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from '../../../_coreStudentMangement/services/admission.service'; 
import { StudentAdmission } from '../../../_coreStudentMangement/models/admission.model'; 
import { StudentMaster } from '../../../_coreStudentMangement/models/student.model'; 
import { StudentGuardian } from '../../../_coreStudentMangement/models/guardian.model'; 

@Component({
  selector: 'app-admission-drawer',
  templateUrl: './admission-drawer.component.html',
  styleUrls: ['./admission-drawer.component.css'],
  standalone: false,
})
export class AdmissionDrawerComponent implements OnInit {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() admissionData: any   = null;
  @Output() onClose  = new EventEmitter<void>();
  @Output() onSaved  = new EventEmitter<void>();

  // Step management
  currentStep = 1;
  totalSteps  = 4;
  steps = [
    { no: 1, label: 'Personal',  icon: 'fa-user' },
    { no: 2, label: 'Guardian',  icon: 'fa-users' },
    { no: 3, label: 'Admission', icon: 'fa-graduation-cap' },
    { no: 4, label: 'Documents', icon: 'fa-file-alt' },
  ];

  // Form data
  student:   StudentMaster   = new StudentMaster();
  guardian:  StudentGuardian = new StudentGuardian();
  admission: StudentAdmission = new StudentAdmission();

  // Dropdowns
  genderList:      any[] = [];
  religionList:    any[] = [];
  bloodGroupList:  any[] = [];
  categoryList:    any[] = [];
  relationList:    any[] = [];
  sessionList:     any[] = [];
  classList:       any[] = [];
  sectionList:     any[] = [];
  shiftList:       any[] = [];
  groupList:       any[] = [];
  docTypeList:     any[] = [];

  // Photo
  photoPreview:    string | null = null;
  photoFile:       File | null   = null;

  // Documents
  docEntries: { docTypeNo: number | null; file: File | null; preview: string }[] = [];

  // State
  isLoading   = true;
  isSaving    = false;
  savedStudentNo:   number | null = null;
  savedAdmissionNo: number | null = null;

  admissionTypes = [
    { value: 'NEW',          label: 'New Admission' },
    { value: 'TRANSFER',     label: 'Transfer' },
    { value: 'RE_ADMISSION', label: 'Re-Admission' },
  ];

  constructor(
    private admissionService: AdmissionService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.loadAllDropdowns();
    if (this.mode === 'edit' && this.admissionData) {
      this.patchFormData();
    }
  }

  loadAllDropdowns() {
    this.isLoading = true;
    forkJoin({
      genders:     this.admissionService.getAllGenders(),
      religions:   this.admissionService.getAllReligions(),
      bloodGroups: this.admissionService.getAllBloodGroups(),
      categories:  this.admissionService.getAllCategories(),
      relations:   this.admissionService.getAllRelations(),
      sessions:    this.admissionService.getAllSessions(),
      classes:     this.admissionService.getAllClasses(),
      shifts:      this.admissionService.getAllShifts(),
      groups:      this.admissionService.getAllGroups(),
      docTypes:    this.admissionService.getAllDocTypes(),
    }).pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          this.genderList     = res.genders     || [];
          this.religionList   = res.religions   || [];
          this.bloodGroupList = res.bloodGroups || [];
          this.categoryList   = res.categories  || [];
          this.relationList   = res.relations   || [];
          this.sessionList    = res.sessions    || [];
          this.classList      = res.classes     || [];
          this.shiftList      = res.shifts      || [];
          this.groupList      = res.groups      || [];
          this.docTypeList    = res.docTypes    || [];
          this.initDocEntries();
        },
        error: () => this.toastr.error('Failed to load form data.'),
      });
  }

  initDocEntries() {
    this.docEntries = this.docTypeList.map(dt => ({
      docTypeNo: dt.id,
      file: null,
      preview: '',
    }));
  }

  patchFormData() {
    const d = this.admissionData;
    Object.assign(this.student, d.student || d);
    Object.assign(this.guardian, d.guardian || {});
    Object.assign(this.admission, d);
    if (d.photoPath) this.photoPreview = d.photoPath;
  }

  // ── Class change → load sections ────────────────────
  onClassChange(classId: number) {
    if (!classId) { this.sectionList = []; return; }
    this.admissionService.getAllSections().subscribe({
      next: (res: any[]) => {
        this.sectionList = res || [];
      },
    });
  }

  // ── Photo ────────────────────────────────────────────
  onPhotoChange(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      this.toastr.warning('Photo size must be less than 2MB'); return;
    }
    this.photoFile = file;
    const reader   = new FileReader();
    reader.onload  = () => (this.photoPreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  clearPhoto() {
    this.photoFile    = null;
    this.photoPreview = null;
  }

  // ── Document ─────────────────────────────────────────
  onDocFileChange(event: any, index: number) {
    const file: File = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      this.toastr.warning('File size must be less than 5MB'); return;
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
    this.docEntries[index].file    = null;
    this.docEntries[index].preview = '';
  }

  // ── Navigation ───────────────────────────────────────
  goToStep(step: number) {
    if (step > this.currentStep && !this.validateCurrentStep()) return;
    this.currentStep = step;
  }

  nextStep() {
    if (!this.validateCurrentStep()) return;
    if (this.currentStep === 3 && this.mode === 'add') {
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
        this.toastr.warning("Student full name can't be empty!"); return false;
      }
      if (!this.student.dateOfBirth) {
        this.toastr.warning("Date of birth can't be empty!"); return false;
      }
      if (!this.student.genderNo) {
        this.toastr.warning("Gender can't be empty!"); return false;
      }
    }
    if (this.currentStep === 2) {
      if (!this.guardian.guardianName) {
        this.toastr.warning("Guardian name can't be empty!"); return false;
      }
      if (!this.guardian.mobileNo) {
        this.toastr.warning("Guardian mobile can't be empty!"); return false;
      }
      if (!this.guardian.relationNo) {
        this.toastr.warning("Guardian relation can't be empty!"); return false;
      }
    }
    if (this.currentStep === 3) {
      if (!this.admission.academicSessionNo) {
        this.toastr.warning("Academic session can't be empty!"); return false;
      }
      if (!this.admission.classMasterNo) {
        this.toastr.warning("Class can't be empty!"); return false;
      }
    }
    return true;
  }

  // ── Save ─────────────────────────────────────────────
  saveAdmission() {
    this.isSaving = true;
    const payload = {
      student:   this.student,
      guardian:  this.guardian,
      admission: this.admission,
    };

    const req$ = this.mode === 'edit'
      ? this.admissionService.update(payload)
      : this.admissionService.save(payload);

    req$.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.savedStudentNo   = res.obj?.studentNo;
          this.savedAdmissionNo = res.obj?.admissionNo;

          // Upload photo if selected
          if (this.photoFile && this.savedStudentNo) {
            this.admissionService.uploadPhoto(
              this.savedStudentNo, this.photoFile
            ).subscribe();
          }

          // Move to document step
          this.currentStep = 4;
          this.toastr.success(res.message || 'Admission saved!');
        } else {
          this.toastr.warning(res.message || 'Save failed.');
        }
      },
      error: () => {
        this.toastr.error('Something went wrong. Please try again.');
      },
    });
  }

  uploadPendingDocuments() {
    const pendingDocs = this.docEntries.filter(d => d.file && d.docTypeNo);
    if (pendingDocs.length === 0) {
      this.onSaved.emit();
      return;
    }
    let uploaded = 0;
    pendingDocs.forEach(doc => {
      this.admissionService.uploadDocument(
        this.savedStudentNo!, this.savedAdmissionNo!, doc.docTypeNo!, doc.file!
      ).subscribe({
        next: () => {
          uploaded++;
          if (uploaded === pendingDocs.length) this.onSaved.emit();
        },
        error: () => {
          this.toastr.warning('Some documents failed to upload.');
          uploaded++;
          if (uploaded === pendingDocs.length) this.onSaved.emit();
        },
      });
    });
  }

  finishAndClose() {
    if (this.savedStudentNo) {
      this.uploadPendingDocuments();
    } else {
      this.onSaved.emit();
    }
  }

  get stepProgress(): number {
    return ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
  }
}