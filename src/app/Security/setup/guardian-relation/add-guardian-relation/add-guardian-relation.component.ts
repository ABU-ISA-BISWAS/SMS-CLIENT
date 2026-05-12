import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GuardianRelation } from '../../../_coreSecurity/models/guardian-relation.model'; 
import { GuardianRelationService } from '../../../_coreSecurity/services/guardian-relation.service'; 
@Component({
  selector: 'app-add-guardian-relation',
  templateUrl: './add-guardian-relation.component.html',
  styleUrls: ['./add-guardian-relation.component.css'],
  standalone: false,
})
export class AddGuardianRelationComponent implements OnInit {
  guardianRelation: GuardianRelation = new GuardianRelation();
  onClose!: Subject<boolean>;
  validate!: boolean;
  title = '';
  isSaving: boolean = false;
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(
    public bsModalRef: BsModalRef,
    private guardianRelationService: GuardianRelationService,
    private toastr: ToastrService,
    private iconModal: BsModalRef,
    private modalService: BsModalService,
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
  }

  saveGuardianRelations() {
    this.isSaving = true;
    this.toogleValue(this.guardianRelation);

    if (!this.checkValidation()) {
      this.isSaving = false;
      this.toastr.warning('Validation failed. Please check your input.');
      return;
    }

    if (this.guardianRelation.id) {
      this.guardianRelationService
        .updateGuardianRelation(this.guardianRelation)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(
                res.message || 'GuardianRelation updated successfully!',
              );
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(res.message || 'Failed to update GuardianRelation.');
              this.onClose.next(false);
              this.validate = true;
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while updating the GuardianRelation. Please try again.',
            );
            this.onClose.next(false);
          },
        });
    } else {
      this.guardianRelationService
        .saveGuardianRelation(this.guardianRelation)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(res.message || 'GuardianRelation saved successfully!');
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(res.message || 'Failed to save GuardianRelation.');
              this.onClose.next(false);
              this.validate = true;
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while saving the GuardianRelation. Please try again.',
            );
            this.onClose.next(false);
          },
        });
    }
  }

  checkValidation() {
    if (!this.guardianRelation.name) {
      this.toastr.warning("GuardianRelation Name can't be empty!");
      return false;
    } 
    return true;
  }

  toogleValue(obj: GuardianRelation) {
    Object.keys(obj).forEach((key) => {
      const typedKey = key as keyof GuardianRelation;
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
