import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { EmployeeModel } from '../../../../_coreSecurity/models/employee.model';
import { EmployeeService } from '../../../../_coreSecurity/services/employee.service';

@Component({
  selector: 'app-personal-info-tab',
  templateUrl: './personal-info-tab.component.html',
  styleUrls: ['./personal-info-tab.component.css'],
  standalone: false,
})
export class PersonalInfoTabComponent implements OnInit {
  @Input('jobType') jobTypeList: any;
  @Input('maritalStatus') maritalStatus: any;
  @Input('jobTitle') jobTitleList: any;
  @Input('department') departmentList: any;
  @Input('gender') genderList: any;

  @Input()
  salutationList: any[] = [];

  @Input('editPersonalInfo')
  editPersonalInfo!: EmployeeModel;

  @ViewChild('doctorField')
  doctorField!: ElementRef;
  doctorEmpty: boolean = false;
  employee: EmployeeModel = new EmployeeModel();

  @Input('doctorNo') doctorSelect: string | null = null;
  doctorDatasource!: Observable<any>;
  selectedDoctor: any;
  typeaheadLoading: boolean = false;
  noResult: boolean = false;
  showInfo: boolean = false;

  empNoChecker: boolean = false;
  personalNumberChecker: boolean = false;
  oldEmpId!: string | null;

  constructor(
    private empService: EmployeeService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.employee.joinDate = new Date();

    if (this.editPersonalInfo) {
      console.log('inside personal tab', this.editPersonalInfo);
      this.employee = this.editPersonalInfo;
      this.oldEmpId = this.editPersonalInfo.empId;
      this.employee.dob = moment(new Date(this.employee.dob)).toDate();
      this.employee.joinDate = moment(
        new Date(this.employee.joinDate),
      ).toDate();
    }
  }

  changeTypeaheadLoading(e: boolean): void {
    if (!this.doctorSelect?.length) {
      this.selectedDoctor = null;
    }

    this.typeaheadLoading = e;
  }

  typeaheadNoResults(e: boolean): void {
    this.noResult = e;
    this.showInfo = false;
  }

  selectDoctor(getVal: any) {
    if (getVal.item.doctorNo != null || getVal.item.doctorNo != undefined) {
      this.selectedDoctor = getVal.item;
      this.employee.fname = getVal.item.firstName;
      this.doctorSelect = getVal.item.doctorName;
      this.employee.doctorNo = getVal.item.doctorNo;

      this.showInfo = true;
      console.log('selected Emp', this.selectedDoctor);
    } else {
      this.toastr.warning('DoctorNo is Undefined!');
      this.doctorSelect = '';
    }
  }

  validateEmpNo(data: string | number | boolean) {
    if (!this.employee.id) {
      this.empService.validateEmpId(data).subscribe((res: { success: any }) => {
        res.success ? (this.empNoChecker = true) : (this.empNoChecker = false);
      });
    }
    console.log('here', this.oldEmpId, this.employee.empId);
    if (
      this.employee.id &&
      this.employee.empId?.toLowerCase() !== this.oldEmpId?.toLowerCase()
    ) {
      console.log('true');

      this.empService.validateEmpId(data).subscribe((res: { success: any }) => {
        res.success ? (this.empNoChecker = true) : (this.empNoChecker = false);
      });
    }
  }

  searchByPersonalNumber() {
    if (this.employee.personalNumber) {
      this.empService
        .searchByPersonalNumber(this.employee.personalNumber)
        .subscribe((res: { success: any; message: string | undefined }) => {
          if (!res.success) {
            this.employee.personalNumber = null;
            this.toastr.warning(res.message);
            this.personalNumberChecker = true;
          }
        });
    }
  }
}
