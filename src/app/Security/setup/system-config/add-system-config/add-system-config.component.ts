import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SystemConfig } from '../../../_coreSecurity/models/system-config.model';
import { SystemConfigService } from '../../../_coreSecurity/services/system-config.service';
@Component({
  selector: 'app-add-system-config',
  templateUrl: './add-system-config.component.html',
  styleUrls: ['./add-system-config.component.css'],
  standalone: false,
})
export class AddSystemConfigComponent implements OnInit {
  systemConfig: SystemConfig = new SystemConfig();
  onClose!: Subject<boolean>;
  validate!: boolean;
  title = '';
  isSaving: boolean = false;
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(
    public bsModalRef: BsModalRef,
    private systemConfigService: SystemConfigService,
    private toastr: ToastrService,
    private iconModal: BsModalRef,
    private modalService: BsModalService,
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
  }

  saveConfigs() {
    this.isSaving = true;
    this.toogleValue(this.systemConfig);

    if (!this.checkValidation()) {
      this.isSaving = false;
      this.toastr.warning('Validation failed. Please check your input.');
      return;
    }

    if (this.systemConfig.id) {
      this.systemConfigService
        .updateConfig(this.systemConfig)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(
                res.message || 'Config updated successfully!',
              );
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(res.message || 'Failed to update config.');
              this.onClose.next(false);
              this.validate = true;
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while updating the config. Please try again.',
            );
            this.onClose.next(false);
          },
        });
    } else {
      this.systemConfigService
        .saveConfig(this.systemConfig)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(res.message || 'Config saved successfully!');
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(res.message || 'Failed to save config.');
              this.onClose.next(false);
              this.validate = true;
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while saving the config. Please try again.',
            );
            this.onClose.next(false);
          },
        });
    }
  }

  checkValidation() {
    if (!this.systemConfig.configKey) {
      this.toastr.warning("Config Key can't be empty!");
      return false;
    }
    return true;
  }

  toogleValue(obj: SystemConfig) {
    Object.keys(obj).forEach((key) => {
      const typedKey = key as keyof SystemConfig;
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
