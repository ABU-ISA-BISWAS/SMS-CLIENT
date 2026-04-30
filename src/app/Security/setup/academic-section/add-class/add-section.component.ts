import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AcademicSection } from '../../../_coreSecurity/models/academic-section.model';
import { AcademicSectionService } from '../../../_coreSecurity/services/academic-section.service';
@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.css'],
  standalone: false,
})
export class AddSectionComponent implements OnInit {
  academicSection: AcademicSection = new AcademicSection();
  onClose!: Subject<boolean>;
  validate!: boolean;
  title = '';
  isSaving: boolean = false;
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(
    public bsModalRef: BsModalRef,
    private academicSectionService: AcademicSectionService,
    private toastr: ToastrService,
    private iconModal: BsModalRef,
    private modalService: BsModalService,
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
  }

  saveSections() {
    this.isSaving = true;
    this.toogleValue(this.academicSection);

    if (!this.checkValidation()) {
      this.isSaving = false;
      this.toastr.warning('Validation failed. Please check your input.');
      return;
    }

    if (this.academicSection.id) {
      this.academicSectionService
        .updateSection(this.academicSection)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(
                res.message || 'Section updated successfully!',
              );
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(res.message || 'Failed to update section.');
              this.onClose.next(false);
              this.validate = true;
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while updating the section. Please try again.',
            );
            this.onClose.next(false);
          },
        });
    } else {
      this.academicSectionService
        .saveSection(this.academicSection)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(res.message || 'Section saved successfully!');
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(res.message || 'Failed to save section.');
              this.onClose.next(false);
              this.validate = true;
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while saving the section. Please try again.',
            );
            this.onClose.next(false);
          },
        });
    }
  }

  checkValidation() {
    if (!this.academicSection.sectionName) {
      this.toastr.warning("Section Name can't be empty!");
      return false;
    } else if (!this.academicSection.sectionCode) {
      this.toastr.warning("Start Date can't be empty!");
      return false;
    }
    return true;
  }

  toogleValue(obj: AcademicSection) {
    Object.keys(obj).forEach((key) => {
      const typedKey = key as keyof AcademicSection;
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
