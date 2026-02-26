import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { LookupDetailSerializer } from '../../_coreSecurity/serializers/lookup-detail-serializer';
import { EmployeeService } from '../../_coreSecurity/services/employee.service';
import { AddEmpBankInfoComponent } from './add-emp-bank-info/add-emp-bank-info.component';
import { AddEmpSignatureComponent } from './add-emp-signature/add-emp-signature.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@Component({
  selector: 'app-personnel',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  standalone: false,
})
export class EmployeesComponent implements OnInit {
  @ViewChild('empGrid', { static: false }) empGrid!: ElementRef;
  empTable: any;
  empTableObj: any;
  token!: string;
  bsModalRef!: BsModalRef;
  selectedPersonnel: any;
  genderList: any;
  maritalStatusList: any;
  hrTypeList: any;
  empTypeList: any;
  jobTypeList: any;
  districtList: any;
  countryList: any;
  bloodGroupList: any;
  religionList: any;
  hrBuList: any;
  hrJobTitleList: any;
  salutationList: any;
  reportsToList: any;
  upazilaList: any;
  singlePersonnel: any;
  doctorName: any;
  gridDataParam: any = {};
  departmentFilter: number = 0;
  jobTitleFilter: number = 0;
  jobTypeFilter: number = 0;
  empTypeFilter: number = 0;

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private toastr: ToastrService,
    private empService: EmployeeService,
  ) {}

  ngOnInit() {
    this.getInitialDataList();
    this.getDeptName();
    this.getJobTitle();
  }

  ngAfterViewInit(): void {
    this.initEmpGrid();
  }

  getInitialDataList(): void {
    this.empService.initEmpSetupList().subscribe(
      (res: {
        success: any;
        obj: {
          districtList: any;
          employeeTypeList: any;
          upazilaList: any;
          maritalStatusList: any;
          hrTypeList: any;
          religionList: any;
          jobTypeList: any;
          bloodGroupList: any;
          countryList: any;
          genderList: any;
          salutationList: any;
        };
      }) => {
        if (res.success) {
          this.districtList = new LookupDetailSerializer().toArray(
            res.obj.districtList,
          );
          this.empTypeList = new LookupDetailSerializer().toArray(
            res.obj.employeeTypeList,
          );
          this.upazilaList = new LookupDetailSerializer().toArray(
            res.obj.upazilaList,
          );
          this.maritalStatusList = new LookupDetailSerializer().toArray(
            res.obj.maritalStatusList,
          );
          this.hrTypeList = new LookupDetailSerializer().toArray(
            res.obj.hrTypeList,
          );
          this.religionList = new LookupDetailSerializer().toArray(
            res.obj.religionList,
          );
          this.jobTypeList = new LookupDetailSerializer().toArray(
            res.obj.jobTypeList,
          );
          this.bloodGroupList = new LookupDetailSerializer().toArray(
            res.obj.bloodGroupList,
          );
          this.countryList = new LookupDetailSerializer().toArray(
            res.obj.countryList,
          );
          this.genderList = new LookupDetailSerializer().toArray(
            res.obj.genderList,
          );
          this.salutationList = new LookupDetailSerializer().toArray(
            res.obj.salutationList,
          );
        }
      },
      (err: any) => {
        console.error('Error occured when get all Initial Data response ', err);
      },
    );
  }

  getDeptName(): any {
    this.empService.getDeptName().subscribe((res: any) => {
      this.hrBuList = res;
      console.log('BuName', res);
    });
  }
  getJobTitle(): any {
    this.empService.getJobTitleList().subscribe((res: any) => {
      this.hrJobTitleList = res;
      console.log('jobtitle', res);
    });
  }

  addPersonnel() {
    const initialState = {
      title: 'Add New Employee',
      genderList: this.genderList,
      maritalStatusList: this.maritalStatusList,
      hrTypeList: this.hrTypeList,
      empTypeList: this.empTypeList,
      jobTypeList: this.jobTypeList,
      districtList: this.districtList,
      countryList: this.countryList,
      bloodGroupList: this.bloodGroupList,
      religionList: this.religionList,
      hrBuList: this.hrBuList,
      hrJobTitleList: this.hrJobTitleList,
      salutationList: this.salutationList,
    };
    this.bsModalRef = this.modalService.show(AddEmployeeComponent, {
      class: 'modal-xl base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result == true) {
        this.empTableObj.draw();
      }
    });
  }

  editPersonnel() {
    if (this.singlePersonnel) {
      const initialState = {
        title: 'Edit Employee',
        receiveEditPersonnel: this.singlePersonnel,
        genderList: this.genderList,
        maritalStatusList: this.maritalStatusList,
        hrTypeList: this.hrTypeList,
        empTypeList: this.empTypeList,
        jobTypeList: this.jobTypeList,
        districtList: this.districtList,
        countryList: this.countryList,
        bloodGroupList: this.bloodGroupList,
        religionList: this.religionList,
        hrBuList: this.hrBuList,
        hrJobTitleList: this.hrJobTitleList,
        doctorName: this.doctorName,
        salutationList: this.salutationList,
      };
      this.bsModalRef = this.modalService.show(AddEmployeeComponent, {
        class: 'modal-xl base-modal',
        initialState,
        backdrop: 'static',
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          this.empTableObj.draw();
        }
      });
    } else {
      this.toastr.warning('Please select an employee');
    }
  }

  getEditPersonnel(empNo: string | number | boolean) {
    this.empService
      .getSingleEmployee(empNo)
      .subscribe((res: { doctorNo: any }) => {
        this.singlePersonnel = res;
        console.log('single emp from db', res);
      });
  }

  resetPassword() {
    this.bsModalRef = this.modalService.show(ResetPasswordComponent, {
      class: 'modal-md base-modal',
    });
  }

  resetFilter() {
    this.departmentFilter = 0;
    this.jobTitleFilter = 0;
    this.jobTypeFilter = 0;
    this.empTypeFilter = 0;
    this.empTableObj.draw();
  }

  initEmpGrid() {
    let that = this;
    this.empTable = $(this.empGrid.nativeElement);

    this.empTableObj = this.empTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: {
        url:
          environment.baseUrl +
          environment.authApiUrl +
          '/api/employee/gridList',
        type: 'GET',
        data: function (sendData: {
          businessUnitNo: number;
          jobtitleNo: number;
          jobTypeNo: number;
          empTypeNo: number;
        }) {
          sendData.businessUnitNo = that.departmentFilter;
          sendData.jobtitleNo = that.jobTitleFilter;
          sendData.jobTypeNo = that.jobTypeFilter;
          sendData.empTypeNo = that.empTypeFilter;
        },
        beforeSend: function (xhr: {
          setRequestHeader: (arg0: string, arg1: string) => void;
        }) {
          xhr.setRequestHeader(
            'Authorization',
            'bearer ' + that.authService.getAccessToken(),
          );
          xhr.setRequestHeader('Content-Type', 'application/json');
        },
        dataSrc: function (response: {
          draw: any;
          obj: {
            draw: any;
            recordsTotal: any;
            recordsFiltered: any;
            data: any;
          };
          recordsTotal: any;
          recordsFiltered: any;
        }) {
          response.draw = response.obj.draw;
          response.recordsTotal = response.obj.recordsTotal;
          response.recordsFiltered = response.obj.recordsFiltered;
          return response.obj.data;
        },
        error: function (request: { responseText: any }) {
          console.log('request.responseText', request.responseText);
        },
      },
      order: [[0, 'asc']],
      columns: [
        {
          title: 'Employee',
          data: 'empName',
          name: 'empName',
          render: function (
            data: any,
            type: any,
            row: { photo: string; empName: string },
          ) {
            if (row.photo) {
              return (
                '<div><img src="data:image/jpeg;base64,' +
                row.photo +
                '" width="50px" height="50px" class="rounded-circle boder"><span class="p-1">' +
                row.empName +
                '</span></div>'
              );
            } else {
              return (
                '<div><img src="assets/images/profile-placeholder.jpg" width="50px" height="50px" class="rounded-circle"><span class="p-1">' +
                row.empName +
                '</span></div>'
              );
            }
          },
        },
        {
          title: 'Emp ID.',
          data: 'empId',
          name: 'empId',
        },
        {
          title: 'Emp Name',
          data: 'empName',
          name: 'empName',
        },
        {
          title: 'Dept.',
          data: 'businessUnitName',
        },
        {
          title: 'Job Title',
          data: 'jobTilte',
        },
        {
          title: 'Join Date',
          data: 'joinDate',
          render: (data: string | number | Date) => {
            return moment(new Date(data)).format('DD-MM-YYYY').toString();
          },
        },
      ],
      select: true,
      responsive: true,
      autoWidth: true,
      rowCallback: (row: Node, data: any[] | Object) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          self.selectedPersonnel = data;
          this.singlePersonnel = this.getEditPersonnel(
            self.selectedPersonnel.id,
          );
          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
          }
          if (self.selectedPersonnel.joinDate != null) {
            self.selectedPersonnel.joinDate = new Date(
              self.selectedPersonnel.joinDate,
            );
          }
          if (self.selectedPersonnel.dob != null) {
            self.selectedPersonnel.dob = new Date(self.selectedPersonnel.dob);
          }
          console.log('Selected Personnel ', self.selectedPersonnel);
        });
        return row;
      },
    });
  }

  onChangeDept(): void {
    this.empTableObj.draw();
  }
  onChangeJobtitle() {
    this.empTableObj.draw();
  }
  onChangeJobType() {
    this.empTableObj.draw();
  }
  onChangeEmpType() {
    this.empTableObj.draw();
  }

  deletePersonnel() {
    if (this.selectedPersonnel) {
      const initialState = { title: 'Do you want to Delete?' };
      this.bsModalRef = this.modalService.show(ConfirmationDialog, {
        initialState,
        class: '',
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          this.empService
            .deleteEmployeeById(this.selectedPersonnel.id.toString())
            .subscribe(
              () => {
                this.toastr.success('', 'Delete Successfull');
                this.empTableObj.draw();
                this.selectedPersonnel = '';
              },
              () => {
                this.toastr.warning('', 'Error occuree when Deleting Employee');
              },
            );
        }
      });
    } else {
      this.toastr.warning('Please select an Employee');
    }
  }

  changeFloor() {
    this.empTableObj.draw();
  }

  addSignature(): void {
    console.log('selectedPersonnel:', this.selectedPersonnel);
    if (this.selectedPersonnel) {
      const initialState = {
        employeeObj: this.selectedPersonnel,
      };
      this.bsModalRef = this.modalService.show(AddEmpSignatureComponent, {
        class: 'modal-md base-modal',
        initialState,
        backdrop: 'static',
      });
    } else {
      this.toastr.warning('', 'Please select a Employee');
    }
  }

  addBankInfo(): void {
    console.log('selectedPersonnel:', this.selectedPersonnel);
    if (this.selectedPersonnel) {
      const initialState = {
        title: 'Bank Information',
        employeeObj: this.selectedPersonnel,
      };
      this.bsModalRef = this.modalService.show(AddEmpBankInfoComponent, {
        class: 'modal-lg base-modal',
        initialState,
        backdrop: 'static',
      });
    } else {
      this.toastr.warning('', 'Please select a Employee');
    }
  }

  ngOnDestroy(): void {
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
  }
}
