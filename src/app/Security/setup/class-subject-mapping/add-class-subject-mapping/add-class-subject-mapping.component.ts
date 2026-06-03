import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ClassSubjectMapping } from '../../../_coreSecurity/models/class-subject-mapping.model';
import { ClassSubjectMappingService } from '../../../_coreSecurity/services/class-subject-mapping.service';
@Component({
  selector: 'app-add-class-subject-mapping',
  templateUrl: './add-class-subject-mapping.component.html',
  styleUrls: ['./add-class-subject-mapping.component.css'],
  standalone: false,
})
export class AddClassSubjectMappingComponent implements OnInit {
  mapping: ClassSubjectMapping = new ClassSubjectMapping();
  onClose!: Subject<boolean>;
  title = '';
  isSaving: boolean = false;

  classList: any[] = [];
  groupList: any[] = [];
  subjectList: any[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    private mappingService: ClassSubjectMappingService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
    this.loadDropdowns();
    console.log('class list:::::', this.classList);
    console.log('mapping:::::', this.mapping);
    // activeStatus checkbox default
    if (!this.mapping.id) {
      this.mapping.activeStatus = 1;
    }
  }

  loadDropdowns() {
    this.mappingService.getAllClasses().subscribe({
      next: (res: any) => (this.classList = res.items || []),

      error: () => this.toastr.error('Failed to load class list.'),
    });

    this.mappingService.getAllGroups().subscribe({
      next: (res: any) => (this.groupList = res.items || []),
      error: () => this.toastr.error('Failed to load group list.'),
    });

    this.mappingService.getAllSubjects().subscribe({
      next: (res: any) => (this.subjectList = res.items || []),
      error: () => this.toastr.error('Failed to load subject list.'),
    });
  }

  saveMapping() {
    this.isSaving = true;
    this.toggleValue(this.mapping);

    if (!this.checkValidation()) {
      this.isSaving = false;
      return;
    }

    const req$ = this.mapping.id
      ? this.mappingService.update(this.mapping)
      : this.mappingService.save(this.mapping);

    req$.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success(
            res.message ||
              (this.mapping.id
                ? 'Mapping updated successfully!'
                : 'Mapping saved successfully!'),
          );
          this.onClose.next(true);
          this.bsModalRef.hide();
        } else {
          this.toastr.warning(res.message || 'Operation failed.');
          this.onClose.next(false);
        }
      },
      error: () => {
        this.toastr.error('Something went wrong. Please try again.');
        this.onClose.next(false);
      },
    });
  }

  checkValidation(): boolean {
    if (!this.mapping.classMasterNo) {
      this.toastr.warning("Class can't be empty!");
      return false;
    }
    if (!this.mapping.subjectMasterNo) {
      this.toastr.warning("Subject can't be empty!");
      return false;
    }
    return true;
  }

  toggleValue(obj: any) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === true) obj[key] = 1;
      if (obj[key] === false) obj[key] = 0;
    });
  }
}
