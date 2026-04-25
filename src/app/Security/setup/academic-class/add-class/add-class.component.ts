import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AcademicClass } from '../../../_coreSecurity/models/academic-class.model';
import { AcademicClassService } from '../../../_coreSecurity/services/academic-class.service';
@Component({
  selector: 'app-add-class',
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.css'],
  standalone: false,
})
export class AddClassComponent implements OnInit {
  academicClass: AcademicClass = new AcademicClass();
  onClose!: Subject<boolean>;
  validate!: boolean;
  title = '';
  isSaving: boolean = false;
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(
    public bsModalRef: BsModalRef,
    private academicClassService: AcademicClassService,
    private toastr: ToastrService,
    private iconModal: BsModalRef,
    private modalService: BsModalService,
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
  }

  saveClasses() {
    this.isSaving = true;
    this.toogleValue(this.academicClass);

    if (!this.checkValidation()) {
      this.isSaving = false;
      this.toastr.warning('Validation failed. Please check your input.');
      return;
    }

    if (this.academicClass.id) {
      this.academicClassService
        .updateClass(this.academicClass)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(res.message || 'Class updated successfully!');
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(res.message || 'Failed to update class.');
              this.onClose.next(false);
              this.validate = true;
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while updating the class. Please try again.',
            );
            this.onClose.next(false);
          },
        });
    } else {
      this.academicClassService
        .saveClass(this.academicClass)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(res.message || 'Class saved successfully!');
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(res.message || 'Failed to save class.');
              this.onClose.next(false);
              this.validate = true;
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while saving the class. Please try again.',
            );
            this.onClose.next(false);
          },
        });
    }
  }

  checkValidation() {
    if (!this.academicClass.className) {
      this.toastr.warning("Class Name can't be empty!");
      return false;
    } else if (!this.academicClass.classCode) {
      this.toastr.warning("Start Date can't be empty!");
      return false;
    } else if (!this.academicClass.classOrder) {
      this.toastr.warning("End Date can't be empty!");
      return false;
    }
    return true;
  }

  toogleValue(obj: AcademicClass) {
    Object.keys(obj).forEach((key) => {
      const typedKey = key as keyof AcademicClass;
      const val = obj[typedKey];

      if (val === true) {
        (obj[typedKey] as any) = 1;
      }

      if (val === false) {
        (obj[typedKey] as any) = 0;
      }
    });
  }
}
