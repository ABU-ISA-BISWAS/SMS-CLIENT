import { Component, OnInit } from '@angular/core';
import { ModuleModel } from '../../../_coreSecurity/models/module.model';
import { ModuleService } from '../../../_coreSecurity/services/module.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { IconPickerComponent } from '../../../_coreSecurity/common/icon-picker/icon-picker.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-module',
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.css'],
  standalone: false
})
export class AddModuleComponent implements OnInit {

  title: string = "";
  companyList: any;
  sendModule: any;
  module: ModuleModel = new ModuleModel();
  onClose!: Subject<boolean>;
  isSaving: boolean = false;

  constructor(public bsModalRef: BsModalRef,
    private moduleService: ModuleService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private iconModal: BsModalRef) { }

  ngOnInit() {
    this.onClose = new Subject();
    if (this.sendModule) {
      this.module = this.sendModule;
    }
  }

  saveModule() {
    this.isSaving = true;
    if (this.module.menuId && this.module.menuId.length > 5) {
      this.isSaving = false;
      this.toastr.warning("Module code can't be longer than 5 characters");
      return;
    }

    if (this.module.id) {
      this.moduleService.updateModule(this.module).pipe(
        finalize(() => {
          this.isSaving = false;
        })
      ).subscribe({
        next: (res: { success?: boolean; message?: string }) => {
          if (res.success === false) {
            this.toastr.warning(res.message || 'Failed to update module.');
            this.onClose.next(false);
          } else {
            this.toastr.success(res.message || 'Module updated successfully!');
            this.onClose.next(true);
            this.bsModalRef.hide();
          }
        },
        error: (err) => {
          this.toastr.error('Something went wrong while updating the module. Please try again.');
          this.onClose.next(false);
        }
      });
    } else {
      this.module.activeStatus = 1;
      this.moduleService.saveModule(this.module).pipe(
        finalize(() => {
          this.isSaving = false;
        })
      ).subscribe({
        next: (res: { success?: boolean; message?: string }) => {
          if (res.success === false) {
            this.toastr.warning(res.message || 'Failed to save module.');
            this.onClose.next(false);
          } else {
            this.toastr.success(res.message || 'Module saved successfully!');
            this.onClose.next(true);
            this.bsModalRef.hide();
          }
        },
        error: (err) => {
          this.toastr.error('Something went wrong while saving the module. Please try again.');
          this.onClose.next(false);
        }
      });
    }
  }

  selectIcon() {
    this.iconModal = this.modalService.show(IconPickerComponent, { class: 'modal-md' });
    this.iconModal.content.selectedIcon.subscribe((res: { iconValue: any; }) => {
      this.module.menuIcon = res.iconValue;
    })
  }

}
