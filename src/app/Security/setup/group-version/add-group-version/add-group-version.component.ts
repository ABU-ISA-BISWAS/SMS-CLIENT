import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GroupVersion } from '../../../_coreSecurity/models/group-version.model';
import { GroupVersionService } from '../../../_coreSecurity/services/group-version.service';
@Component({
  selector: 'app-add-group-version',
  templateUrl: './add-group-version.component.html',
  styleUrls: ['./add-group-version.component.css'],
  standalone: false,
})
export class AddGroupVersionComponent implements OnInit {
  groupVersion: GroupVersion = new GroupVersion();
  onClose!: Subject<boolean>;
  validate!: boolean;
  title = '';
  isSaving: boolean = false;
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(
    public bsModalRef: BsModalRef,
    private GroupVersionService: GroupVersionService,
    private toastr: ToastrService,
    private iconModal: BsModalRef,
    private modalService: BsModalService,
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
    this.groupVersion.type = '';
  }

  saveGroupVersions() {
    this.isSaving = true;
    this.toogleValue(this.groupVersion);

    if (!this.checkValidation()) {
      this.isSaving = false;
      this.toastr.warning('Validation failed. Please check your input.');
      return;
    }

    if (this.groupVersion.id) {
      this.GroupVersionService.updateGroupVersion(this.groupVersion)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(
                res.message || 'GroupVersion updated successfully!',
              );
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(
                res.message || 'Failed to update group-version.',
              );
              this.onClose.next(false);
              this.validate = true;
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while updating the group-version. Please try again.',
            );
            this.onClose.next(false);
          },
        });
    } else {
      this.GroupVersionService.saveGroupVersion(this.groupVersion)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(
                res.message || 'GroupVersion saved successfully!',
              );
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(
                res.message || 'Failed to save group-version.',
              );
              this.onClose.next(false);
              this.validate = true;
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while saving the group-version. Please try again.',
            );
            this.onClose.next(false);
          },
        });
    }
  }

  checkValidation() {
    if (!this.groupVersion.name) {
      this.toastr.warning("GroupVersion Name can't be empty!");
      return false;
    }
    return true;
  }

  toogleValue(obj: GroupVersion) {
    Object.keys(obj).forEach((key) => {
      const typedKey = key as keyof GroupVersion;
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
