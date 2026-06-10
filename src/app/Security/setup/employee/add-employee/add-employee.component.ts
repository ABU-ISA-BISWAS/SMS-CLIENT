import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { EmployeeModel } from '../../../_coreSecurity/models/employee.model';
import { EmployeeService } from '../../../_coreSecurity/services/employee.service';
import { AddressTabComponent } from './address-tab/address-tab.component';
import { OfficialInfoTabComponent } from './official-info-tab/official-info-tab.component';
import { PersonalInfoTabComponent } from './personal-info-tab/personal-info-tab.component';

@Component({
  selector: 'app-add-personnel',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
  standalone: false,
})
export class AddEmployeeComponent implements OnInit {
  genderList: any;
  maritalStatusList: any;
  hrTypeList: any;
  empTypeList: any;
  jobTypeList: any;
  hrBuList: any;
  hrJobTitleList: any;
  districtList: any;
  thanaList: any;
  countryList: any;
  bloodGroupList: any;
  religionList: any;
  guardianRelationList: any;
  personnelData: any;
  doctorName: any;
  title = '';
  activeTab: string = 'personalInfo';
  isSaving: boolean = false;

  receiveEditPersonnel: EmployeeModel = new EmployeeModel();
  editPersonalInfo: EmployeeModel = new EmployeeModel();
  editOfficialInfo: EmployeeModel = new EmployeeModel();
  editAddressTab: EmployeeModel = new EmployeeModel();

  @ViewChild(PersonalInfoTabComponent)
  personalTab!: PersonalInfoTabComponent;

  @ViewChild(OfficialInfoTabComponent)
  officialTab!: OfficialInfoTabComponent;

  @ViewChild(AddressTabComponent)
  addressTab!: AddressTabComponent;

  public onClose!: Subject<boolean>;

  constructor(
    public bsModalRef: BsModalRef,
    private empService: EmployeeService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    if (this.receiveEditPersonnel) {
      console.log('received', this.receiveEditPersonnel);
      this.editPersonalInfo = this.receiveEditPersonnel;
      this.editOfficialInfo = this.receiveEditPersonnel;
      this.editAddressTab = this.receiveEditPersonnel;
    }
    this.onClose = new Subject();
  }

  onSaveOrUpdate(): void {
    this.isSaving = true;
    this.personnelData = {
      ...this.personalTab?.employee,
      ...this.officialTab?.employee,
      ...this.addressTab?.employeeaddress,
    };

    this.personnelData.activeStat = this.personnelData.activeStat ? 1 : 0;
    this.personnelData.cashierFlag = this.personnelData.cashierFlag ? 1 : 0;
    this.personnelData.salesrepFlag = this.personnelData.salesrepFlag ? 1 : 0;
    this.personnelData.nurseFlag = this.personnelData.nurseFlag ? 1 : 0;
    this.personnelData.sinOfficerFlag = this.personnelData.sinOfficerFlag
      ? 1
      : 0;
    this.personnelData.prepByEmpFlag = this.personnelData.prepByEmpFlag ? 1 : 0;

    if (!this.personnelData.buNo) {
      this.isSaving = false;
      this.toastr.warning('Please enter Department Name to save the Employee!');
      return;
    }
    if (!this.personnelData.empId) {
      this.isSaving = false;
      this.toastr.warning('Please enter Employee ID to save the Employee!');
      return;
    }
    if (!this.personnelData.fname) {
      this.isSaving = false;
      this.toastr.warning('Please enter Employee Name to save the Employee!');
      return;
    }
    if (!this.personnelData.gender) {
      this.isSaving = false;
      this.toastr.warning('Please enter Gender Data to save the Employee!');
      return;
    }
    if (!this.personnelData.jobtitleNo) {
      this.isSaving = false;
      this.toastr.warning('Please enter Job Title to save the Employee!');
      return;
    }
    if (!this.personnelData.joinDate) {
      this.isSaving = false;
      this.toastr.warning('Please enter Join Date to save the Employee!');
      return;
    }

    if (this.personnelData.id) {
      this.empService
        .updateEmployee(this.personnelData)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(
                res.message || 'Employee updated successfully!',
              );
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(res.message || 'Failed to update employee!');
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while updating. Please check your connection or try again.',
            );
          },
        });
    } else {
      this.empService
        .saveEmployee(this.personnelData)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            if (res.success) {
              this.toastr.success(
                res.message || 'Employee saved successfully!',
              );
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(res.message || 'Failed to save employee!');
            }
          },
          error: (err) => {
            this.toastr.error(
              'Something went wrong while saving. Please check your network or try again.',
            );
          },
        });
    }
  }
}
