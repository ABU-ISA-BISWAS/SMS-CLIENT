import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IconPickerComponent } from '../../../_coreSecurity/common/icon-picker/icon-picker.component';
import { FeatureModel } from '../../../_coreSecurity/models/feature.model';
import { FeatureService } from '../../../_coreSecurity/services/feature.service';
@Component({
  selector: 'app-add-session',
  templateUrl: './add-session.component.html',
  styleUrls: ['./add-session.component.css'],
  standalone: false,
})
export class AddSessionComponent implements OnInit {
  feature: FeatureModel = new FeatureModel();
  parentModuleList: any;
  onClose!: Subject<boolean>;
  sendFeature: any;
  validate!: boolean;
  title = '';
  iconList: any;
  existingFeature!: string;
  isSaving: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    private featureService: FeatureService,
    private toastr: ToastrService,
    private iconModal: BsModalRef,
    private modalService: BsModalService,
  ) {}

  ngOnInit() {
    if (this.feature) {
      this.existingFeature = this.feature.submenuId;
    }
    this.onClose = new Subject();
    this.featureService.getIconList().subscribe((res) => {
      this.iconList = res;
      console.log(res);
    });
  }

  compareFn(a: any, b: any) {
    return a && b && (a.id == b.id || a.menuName == b.menuName);
  }

  saveFeatures() {
    this.isSaving = true;
    this.toogleValue(this.feature);

    if (!this.checkValidation()) {
      this.isSaving = false;
      this.toastr.warning('Validation failed. Please check your input.');
      return;
    }

    if (this.feature.id) {
      this.featureService
        .updateFeature(this.feature)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(
                res.message || 'Feature updated successfully!',
              );
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(res.message || 'Failed to update feature.');
              this.onClose.next(false);
              this.validate = true;
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while updating the feature. Please try again.',
            );
            this.onClose.next(false);
          },
        });
    } else {
      this.featureService
        .saveFeature(this.feature)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(res.message || 'Feature saved successfully!');
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(res.message || 'Failed to save feature.');
              this.onClose.next(false);
              this.validate = true;
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while saving the feature. Please try again.',
            );
            this.onClose.next(false);
          },
        });
    }
  }

  checkValidation() {
    if (!this.feature.submenuName) {
      this.toastr.warning("Feature Name can't be empty!");
      return false;
    } else if (!this.feature.submenuType) {
      this.toastr.warning("Featuer Type can't be empty!");
      return false;
    } else if (!this.feature.slNo) {
      this.toastr.warning("Serial No can't be empty!");
      return false;
    } else if (!this.feature.submenuId) {
      this.toastr.warning("Feature Code can't be empty!");
      return false;
    } else if (!this.feature.pageLink) {
      this.toastr.warning("Feature Page Link can't be empty!");
      return false;
    } else if (!this.feature.menuEntity) {
      this.toastr.warning("Parent Module can't be empty!");
      return false;
    }
    return true;
  }
  selectIcon() {
    this.iconModal = this.modalService.show(IconPickerComponent, {
      class: 'modal-md',
    });
    this.iconModal.content.selectedIcon.subscribe(
      (res: { iconValue: string }) => {
        this.feature.iconName = res.iconValue;
      },
    );
  }
  toogleValue(obj: FeatureModel) {
    Object.keys(obj).forEach((key) => {
      const typedKey = key as keyof FeatureModel;
      const val = obj[typedKey];

      if (val === true) {
        (obj[typedKey] as any) = 1;
      }

      if (val === false) {
        (obj[typedKey] as any) = 0;
      }
    });
  }

  validateFeatureCode() {
    if (this.feature.id && this.existingFeature != this.feature.submenuId) {
      this.featureService
        .validateFeatureCode(this.feature.submenuId)
        .subscribe((res: { success: any }) => {
          if (!res.success) {
            this.validate = true;
          }
        });
    } else if (!this.feature.id && this.feature.submenuId) {
      this.featureService
        .validateFeatureCode(this.feature.submenuId)
        .subscribe((res: { success: any }) => {
          if (!res.success) {
            this.validate = true;
          }
        });
    }
  }
}
