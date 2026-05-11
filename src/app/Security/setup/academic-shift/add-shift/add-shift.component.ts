import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AcademicShift } from '../../../_coreSecurity/models/academic-shift.model';
import { AcademicShiftService } from '../../../_coreSecurity/services/academic-shift.service';
@Component({
  selector: 'app-add-shift',
  templateUrl: './add-shift.component.html',
  styleUrls: ['./add-shift.component.css'],
  standalone: false,
})
export class AddShiftComponent implements OnInit {
  academicShift: AcademicShift = new AcademicShift();
  onClose!: Subject<boolean>;
  validate!: boolean;
  title = '';
  isSaving: boolean = false;
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(
    public bsModalRef: BsModalRef,
    private academicShiftService: AcademicShiftService,
    private toastr: ToastrService,
    private iconModal: BsModalRef,
    private modalService: BsModalService,
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
  }

  saveShifts() {
    console.log('time s::::', this.academicShift.startTime);
    console.log('time e::::', this.academicShift.endTime);
    this.isSaving = true;
    this.toogleValue(this.academicShift);

    if (!this.checkValidation()) {
      this.isSaving = false;
      this.toastr.warning('Validation failed. Please check your input.');
      return;
    }

    if (this.academicShift.id) {
      this.academicShiftService
        .updateShift(this.academicShift)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(res.message || 'Shift updated successfully!');
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(res.message || 'Failed to update shift.');
              this.onClose.next(false);
              this.validate = true;
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while updating the shift. Please try again.',
            );
            this.onClose.next(false);
          },
        });
    } else {
      this.academicShiftService
        .saveShift(this.academicShift)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(res.message || 'Shift saved successfully!');
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(res.message || 'Failed to save shift.');
              this.onClose.next(false);
              this.validate = true;
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while saving the shift. Please try again.',
            );
            this.onClose.next(false);
          },
        });
    }
  }

  checkValidation() {
    if (!this.academicShift.shiftName) {
      this.toastr.warning("Shift Name can't be empty!");
      return false;
    }
    return true;
  }

  toogleValue(obj: AcademicShift) {
    Object.keys(obj).forEach((key) => {
      const typedKey = key as keyof AcademicShift;
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
