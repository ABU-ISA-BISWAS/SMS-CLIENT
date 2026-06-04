import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FeeStructure } from '../../../_coreSecurity/models/fee-structure.model';
import { FeeStructureService } from '../../../_coreSecurity/services/fee-structure.service';

@Component({
  selector: 'app-add-fee-structure',
  templateUrl: './add-fee-structure.component.html',
  styleUrls: ['./add-fee-structure.component.css'],
  standalone: false,
})
export class AddFeeStructureComponent implements OnInit {
  feeStructure: FeeStructure = new FeeStructure();
  onClose!: Subject<boolean>;
  title = '';
  isSaving: boolean = false;

  sessionList: any[] = [];
  classList: any[] = [];
  categoryList: any[] = [];
  feeHeadList: any[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    private feeStructureService: FeeStructureService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
    this.loadDropdowns();
    console.log('List:::', this.feeHeadList);
    if (!this.feeStructure.id) {
      this.feeStructure.activeStatus = 1;
      this.feeStructure.fineAmount = 0;
      this.feeStructure.dueDay = 10;
    }
  }

  loadDropdowns() {
    this.feeStructureService.getAllSessions().subscribe({
      next: (res: any) => (this.sessionList = res.items || []),
      error: () => this.toastr.error('Failed to load sessions.'),
    });
    this.feeStructureService.getAllClasses().subscribe({
      next: (res: any) => (this.classList = res.items || []),
      error: () => this.toastr.error('Failed to load classes.'),
    });
    this.feeStructureService.getAllCategories().subscribe({
      next: (res: any) => (this.categoryList = res.items || []),
      error: () => this.toastr.error('Failed to load categories.'),
    });
    this.feeStructureService.getAllFeeHeads().subscribe({
      next: (res: any) => (this.feeHeadList = res.items || []),
      error: () => this.toastr.error('Failed to load fee heads.'),
    });
  }

  saveFeeStructure() {
    this.isSaving = true;
    // this.toggleValue(this.feeStructure);

    console.log('BEFORE toggleValue:', JSON.stringify(this.feeStructure));
    this.toggleValue(this.feeStructure);
    console.log('AFTER toggleValue:', JSON.stringify(this.feeStructure));

    if (!this.checkValidation()) {
      this.isSaving = false;
      return;
    }

    const req$ = this.feeStructure.id
      ? this.feeStructureService.update(this.feeStructure)
      : this.feeStructureService.save(this.feeStructure);

    req$.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success(
            res.message ||
              (this.feeStructure.id
                ? 'Fee structure updated successfully!'
                : 'Fee structure saved successfully!'),
          );
          this.onClose.next(true);
          this.bsModalRef.hide();
        } else {
          this.toastr.warning(res.message || 'Operation failed.');
          this.onClose.next(false);
        }
      },
      error: () => {
        this.toastr.error('Something went wrong. Please try again.');
        this.onClose.next(false);
      },
    });
  }

  checkValidation(): boolean {
    if (!this.feeStructure.academicSessionNo) {
      this.toastr.warning("Academic Session can't be empty!");
      return false;
    }
    if (!this.feeStructure.classMasterNo) {
      this.toastr.warning("Class can't be empty!");
      return false;
    }
    if (!this.feeStructure.feeHeadNo) {
      this.toastr.warning("Fee Head can't be empty!");
      return false;
    }
    if (!this.feeStructure.amount || this.feeStructure.amount <= 0) {
      this.toastr.warning('Amount must be greater than 0!');
      return false;
    }
    return true;
  }

  toggleValue(obj: any) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === true) obj[key] = 1;
      if (obj[key] === false) obj[key] = 0;
    });
  }
}
