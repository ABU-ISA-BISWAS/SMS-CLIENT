import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { StudentCategory } from '../../../_coreSecurity/models/student-category.model'; 
import { StudentCategoryService } from '../../../_coreSecurity/services/student-category.service'; 
@Component({
  selector: 'app-add-student-category',
  templateUrl: './add-student-category.component.html',
  styleUrls: ['./add-student-category.component.css'],
  standalone: false,
})
export class AddStudentCategoryComponent implements OnInit {
  studentCategory: StudentCategory = new StudentCategory();
  onClose!: Subject<boolean>;
  validate!: boolean;
  title = '';
  isSaving: boolean = false;
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(
    public bsModalRef: BsModalRef,
    private studentCategoryService: StudentCategoryService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
  }

  saveStudentCategorys() {
    this.isSaving = true;
    this.toogleValue(this.studentCategory);

    if (!this.checkValidation()) {
      this.isSaving = false;
      this.toastr.warning('Validation failed. Please check your input.');
      return;
    }

    if (this.studentCategory.id) {
      this.studentCategoryService.updateStudentCategory(this.studentCategory)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(
                res.message || 'StudentCategory updated successfully!',
              );
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(
                res.message || 'Failed to update Student Category.',
              );
              this.onClose.next(false);
              this.validate = true;
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while updating the Student Category. Please try again.',
            );
            this.onClose.next(false);
          },
        });
    } else {
      this.studentCategoryService.saveStudentCategory(this.studentCategory)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(
                res.message || 'StudentCategory saved successfully!',
              );
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(
                res.message || 'Failed to save Student Category.',
              );
              this.onClose.next(false);
              this.validate = true;
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while saving the student category. Please try again.',
            );
            this.onClose.next(false);
          },
        });
    }
  }

  checkValidation() {
    if (!this.studentCategory.categoryName) {
      this.toastr.warning("Student category Name can't be empty!");
      return false;
    }
    return true;
  }

  toogleValue(obj: StudentCategory) {
    Object.keys(obj).forEach((key) => {
      const typedKey = key as keyof StudentCategory;
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
