import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { EmployeeModel } from '../../../_coreSecurity/models/employee.model';
import { EmployeeService } from '../../../_coreSecurity/services/employee.service';

@Component({
  selector: 'app-add-personnel',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
  standalone: false,
})
export class AddEmployeeComponent implements OnInit {
  // ── Passed from parent ────────────────────────────────
  genderList: any;
  maritalStatusList: any;
  empTypeList: any;
  jobTypeList: any;
  hrBuList: any;
  hrJobTitleList: any;
  districtList: any;
  countryList: any;
  bloodGroupList: any;
  religionList: any;
  guardianRelationList: any;
  doctorName: any;
  title = '';

  imgFile!: File;

  // ── For edit: passed from parent ──────────────────────
  receiveEditPersonnel: EmployeeModel = new EmployeeModel();

  // ── Single shared model (replaces editPersonalInfo etc.) ─
  sharedEmployee: EmployeeModel = new EmployeeModel();

  activeTab: string = 'personalInfo';
  isSaving: boolean = false;

  public onClose!: Subject<boolean>;

  constructor(
    public bsModalRef: BsModalRef,
    private empService: EmployeeService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.onClose = new Subject();

    // Patch shared model if editing
    if (this.receiveEditPersonnel?.id) {
      Object.assign(this.sharedEmployee, this.receiveEditPersonnel);
    }
  }

  onSaveOrUpdate(): void {
    this.isSaving = true;

    const payload: any = { ...this.sharedEmployee };
    payload.activeStat = payload.activeStat ? 1 : 0;

    if (!payload.buNo) {
      this.isSaving = false;
      this.toastr.warning('Please enter Department Name!');
      return;
    }
    if (!payload.empId) {
      this.isSaving = false;
      this.toastr.warning('Please enter Employee ID!');
      return;
    }
    if (!payload.fname) {
      this.isSaving = false;
      this.toastr.warning('Please enter Employee Name!');
      return;
    }
    if (!payload.gender) {
      this.isSaving = false;
      this.toastr.warning('Please enter Gender!');
      return;
    }
    if (!payload.jobtitleNo) {
      this.isSaving = false;
      this.toastr.warning('Please enter Job Title!');
      return;
    }
    if (!payload.joinDate) {
      this.isSaving = false;
      this.toastr.warning('Please enter Join Date!');
      return;
    }

    const req$ = payload.id
      ? this.empService.updateEmployeeWithImage(payload, this.imgFile)
      : this.empService.saveEmployeeWithImage(payload, this.imgFile);

    req$.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: (res: { success: boolean; message?: string }) => {
        if (res.success) {
          this.toastr.success(
            res.message ||
              (payload.id
                ? 'Employee updated successfully!'
                : 'Employee saved successfully!'),
          );
          this.onClose.next(true);
          this.bsModalRef.hide();
        } else {
          this.toastr.warning(res.message || 'Operation failed.');
        }
      },
      error: () => {
        this.toastr.error('Something went wrong. Please try again.');
      },
    });
  }

  fileImmite(imgFiledata: any) {
    this.imgFile = imgFiledata;
    console.log('imgFile', this.imgFile);
  }
}
