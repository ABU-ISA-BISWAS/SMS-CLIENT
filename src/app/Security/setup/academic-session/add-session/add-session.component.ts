import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AcademicSession } from '../../../_coreSecurity/models/academic-session.model';
import { AcademicSessionService } from '../../../_coreSecurity/services/academic-session.service';
import { FeatureService } from '../../../_coreSecurity/services/feature.service';
@Component({
  selector: 'app-add-session',
  templateUrl: './add-session.component.html',
  styleUrls: ['./add-session.component.css'],
  standalone: false,
})
export class AddSessionComponent implements OnInit {
  academicSession: AcademicSession = new AcademicSession();
  onClose!: Subject<boolean>;
  sendFeature: any;
  validate!: boolean;
  title = '';
  existingFeature!: string;
  isSaving: boolean = false;
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(
    public bsModalRef: BsModalRef,
    private featureService: FeatureService,
    private academicSessionService: AcademicSessionService,
    private toastr: ToastrService,
    private iconModal: BsModalRef,
    private modalService: BsModalService,
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
  }

  saveFeatures() {
    this.isSaving = true;
    this.toogleValue(this.academicSession);

    if (!this.checkValidation()) {
      this.isSaving = false;
      this.toastr.warning('Validation failed. Please check your input.');
      return;
    }

    if (this.academicSession.id) {
      this.academicSessionService
        .updateSession(this.academicSession)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(
                res.message || 'Session updated successfully!',
              );
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(res.message || 'Failed to update session.');
              this.onClose.next(false);
              this.validate = true;
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while updating the session. Please try again.',
            );
            this.onClose.next(false);
          },
        });
    } else {
      this.academicSessionService
        .saveSession(this.academicSession)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(res.message || 'Session saved successfully!');
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(res.message || 'Failed to save session.');
              this.onClose.next(false);
              this.validate = true;
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while saving the session. Please try again.',
            );
            this.onClose.next(false);
          },
        });
    }
  }

  checkValidation() {
    if (!this.academicSession.sessionName) {
      this.toastr.warning("Session Name can't be empty!");
      return false;
    }
    //  else if (!this.academicSession.startDate) {
    //   this.toastr.warning("Start Date can't be empty!");
    //   return false;
    // } else if (!this.academicSession.endDate) {
    //   this.toastr.warning("End Date can't be empty!");
    //   return false;
    // }
    return true;
  }

  toogleValue(obj: AcademicSession) {
    Object.keys(obj).forEach((key) => {
      const typedKey = key as keyof AcademicSession;
      const val = obj[typedKey];

      if (val === true) {
        (obj[typedKey] as any) = 1;
      }

      if (val === false) {
        (obj[typedKey] as any) = 0;
      }
    });
  }

  onEndYearModelChange(date: Date) {
    if (date instanceof Date && !isNaN(date.getTime())) {
      const year = date.getFullYear();
      this.academicSession.endDate = year;
    }
  }

  onStartYearModelChange(date: Date) {
    if (date instanceof Date && !isNaN(date.getTime())) {
      const year = date.getFullYear();
      this.academicSession.startDate = year;
    }
  }
}
