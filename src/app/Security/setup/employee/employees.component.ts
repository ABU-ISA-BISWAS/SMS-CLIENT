import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { EmployeeService } from '../../_coreSecurity/services/employee.service';
import { AddEmpBankInfoComponent } from './add-emp-bank-info/add-emp-bank-info.component';
import { AddEmpSignatureComponent } from './add-emp-signature/add-emp-signature.component';
import { AddressTabComponent } from './add-employee/address-tab/address-tab.component';
import { OfficialInfoTabComponent } from './add-employee/official-info-tab/official-info-tab.component';
import { PersonalInfoTabComponent } from './add-employee/personal-info-tab/personal-info-tab.component';

@Component({
  selector: 'app-personnel',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  standalone: false,
})
export class EmployeesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('empGrid', { static: false }) empGrid!: ElementRef;

  // ── Tab child refs ────────────────────────────────────
  @ViewChild('personalTab') personalTab!: PersonalInfoTabComponent;
  @ViewChild('officialTab') officialTab!: OfficialInfoTabComponent;
  @ViewChild('addressTab') addressTab!: AddressTabComponent;

  bsModalRef!: BsModalRef;
  empTable: any;
  empTableObj: any;

  selectedPersonnel: any = null;
  singlePersonnel: any = null;

  // ── Filter dropdowns ──────────────────────────────────
  hrBuList: any[] = [];
  hrJobTitleList: any[] = [];
  jobTypeList: any[] = [];
  empTypeList: any[] = [];

  departmentFilter: number = 0;
  jobTitleFilter: number = 0;
  jobTypeFilter: number = 0;
  empTypeFilter: number = 0;

  // ── Form dropdowns ────────────────────────────────────
  genderList: any[] = [];
  maritalStatusList: any[] = [];
  districtList: any[] = [];
  countryList: any[] = [];
  bloodGroupList: any[] = [];
  religionList: any[] = [];
  salutationList: any[] = [];
  doctorName: any;

  // ── View toggle ───────────────────────────────────────
  isFormVisible = false;
  formMode: 'add' | 'edit' = 'add';

  activeTab: 'personalInfo' | 'officialInfo' | 'address' = 'personalInfo';

  tabs: {
    key: 'personalInfo' | 'officialInfo' | 'address';
    label: string;
    icon: string;
  }[] = [
    { key: 'personalInfo', label: 'Basic Information', icon: 'fa-user' },
    { key: 'officialInfo', label: 'Other Information', icon: 'fa-briefcase' },
    { key: 'address', label: 'Address Details', icon: 'fa-map-marker-alt' },
  ];

  // ── Edit data refs ────────────────────────────────────
  editPersonalInfo: any = {};
  editOfficialInfo: any = {};
  editAddressTab: any = {};

  isSaving = false;

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private toastr: ToastrService,
    private empService: EmployeeService,
  ) {}

 ngOnInit() {
    this.getDeptName();
    this.getJobTitleAndJobType();
    this.getEmpType();
    this.getMaritalStatus();
    this.getGender();
    this.getBloodGroup();
    this.getReligion();
    this.getDistrict();


  }

  ngAfterViewInit(): void {
    this.initEmpGrid();
    console.log("Job Type List", this.hrJobTitleList);
  }
  // ── Initial data load ─────────────────────────────────

  getDeptName(): void {
    this.empService.getDeptName().subscribe({
      next: (res: any) => (this.hrBuList = res || []),
    });
  }

 getJobTitleAndJobType(): void {
    this.empService.getJobTitleAndJobType().subscribe({
      next: (res: any) => (this.hrJobTitleList = res || []),
    });
  }

    getEmpType(): void {
    this.empService.getEmpType().subscribe({
      next: (res: any) => (this.empTypeList = res || []),
    });
  }

    getMaritalStatus(): void {
    this.empService.getMaritalStatus().subscribe({
      next: (res: any) => (this.maritalStatusList = res || []),
    });
  }

    getDistrict(): void {
    this.empService.getDistrict().subscribe({
      next: (res: any) => (this.districtList = res || []),
    });
  }
    getGender(): void {
    this.empService.getGender().subscribe({
      next: (res: any) => (this.genderList = res || []),
    });
  }
    getBloodGroup(): void {
    this.empService.getBloodGroup().subscribe({
      next: (res: any) => (this.bloodGroupList = res || []),
    });
  }
    getReligion(): void {
    this.empService.getReligion().subscribe({
      next: (res: any) => (this.religionList = res || []),
    });
  }

  // ── Form Open / Close ─────────────────────────────────
  openForm(mode: 'add' | 'edit') {
    if (mode === 'edit') {
      if (!this.singlePersonnel) {
        this.toastr.warning('Please select an employee to edit.');
        return;
      }
    }

    this.formMode = mode;
    this.activeTab = 'personalInfo';

    if (mode === 'edit' && this.singlePersonnel) {
      this.editPersonalInfo = { ...this.singlePersonnel };
      this.editOfficialInfo = { ...this.singlePersonnel };
      this.editAddressTab = { ...this.singlePersonnel };
    } else {
      this.editPersonalInfo = {};
      this.editOfficialInfo = {};
      this.editAddressTab = {};
    }

    this.isFormVisible = true;

    if (this.empTableObj) {
      this.empTableObj.destroy();
      this.empTableObj = null;
    }
  }

  closeForm() {
    this.isFormVisible = false;
    this.editPersonalInfo = {};
    this.editOfficialInfo = {};
    this.editAddressTab = {};
    this.isSaving = false;
    setTimeout(() => this.initEmpGrid(), 50);
  }

  // ── Collect data from all tabs and save ───────────────
  collectAndSave() {
    const personnelData = {
      ...this.personalTab?.employee,
      ...this.officialTab?.employee,
      ...this.addressTab?.employeeaddress,
    };
    this.onSaveOrUpdate(personnelData);
  }

  onSaveOrUpdate(personnelData: any): void {
    this.isSaving = true;

    personnelData.activeStat = personnelData.activeStat ? 1 : 0;
    personnelData.cashierFlag = personnelData.cashierFlag ? 1 : 0;
    personnelData.salesrepFlag = personnelData.salesrepFlag ? 1 : 0;
    personnelData.nurseFlag = personnelData.nurseFlag ? 1 : 0;
    personnelData.sinOfficerFlag = personnelData.sinOfficerFlag ? 1 : 0;
    personnelData.prepByEmpFlag = personnelData.prepByEmpFlag ? 1 : 0;

    if (!personnelData.buNo) {
      this.isSaving = false;
      this.toastr.warning('Please enter Department Name!');
      return;
    }
    if (!personnelData.empId) {
      this.isSaving = false;
      this.toastr.warning('Please enter Employee ID!');
      return;
    }
    if (!personnelData.fname) {
      this.isSaving = false;
      this.toastr.warning('Please enter Employee Name!');
      return;
    }
    if (!personnelData.gender) {
      this.isSaving = false;
      this.toastr.warning('Please enter Gender!');
      return;
    }
    if (!personnelData.jobtitleNo) {
      this.isSaving = false;
      this.toastr.warning('Please enter Job Title!');
      return;
    }
    if (!personnelData.joinDate) {
      this.isSaving = false;
      this.toastr.warning('Please enter Join Date!');
      return;
    }

    const req$ = personnelData.id
      ? this.empService.updateEmployee(personnelData)
      : this.empService.saveEmployee(personnelData);

    req$.subscribe({
      next: (res: { success: boolean; message?: string }) => {
        this.isSaving = false;
        if (res.success) {
          this.toastr.success(
            res.message ||
              (personnelData.id
                ? 'Employee updated successfully!'
                : 'Employee saved successfully!'),
          );
          this.closeForm();
        } else {
          this.toastr.warning(res.message || 'Operation failed.');
        }
      },
      error: () => {
        this.isSaving = false;
        this.toastr.error('Something went wrong. Please try again.');
      },
    });
  }

  // ── Get single employee (for edit) ────────────────────
  getEditPersonnel(empNo: any) {
    this.empService.getSingleEmployee(empNo).subscribe((res: any) => {
      this.singlePersonnel = res;
    });
  }

  // ── Delete ────────────────────────────────────────────
  deletePersonnel() {
    if (!this.selectedPersonnel) {
      this.toastr.warning('Please select an Employee.');
      return;
    }
    const initialState = { title: 'Do you want to Delete this Employee?' };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.empService
          .deleteEmployeeById(this.selectedPersonnel.id.toString())
          .subscribe({
            next: () => {
              this.toastr.success('Employee deleted successfully!');
              this.selectedPersonnel = null;
              this.singlePersonnel = null;
              this.empTableObj.draw();
            },
            error: () => this.toastr.error('Error occurred when deleting.'),
          });
      }
    });
  }

  // ── Add Signature ─────────────────────────────────────
  addSignature(): void {
    if (!this.selectedPersonnel) {
      this.toastr.warning('Please select an Employee first.');
      return;
    }
    const initialState = {
      title: 'Add / Update Signature',
      employeeObj: this.selectedPersonnel,
    };
    this.bsModalRef = this.modalService.show(AddEmpSignatureComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose?.subscribe((result: boolean) => {
      if (result) this.empTableObj?.draw();
    });
  }

  // ── Add Bank Info ─────────────────────────────────────
  addBankInfo(): void {
    if (!this.selectedPersonnel) {
      this.toastr.warning('Please select an Employee first.');
      return;
    }
    const initialState = {
      title: 'Bank Information',
      employeeObj: this.selectedPersonnel,
    };
    this.bsModalRef = this.modalService.show(AddEmpBankInfoComponent, {
      class: 'modal-lg base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose?.subscribe((result: boolean) => {
      if (result) this.empTableObj?.draw();
    });
  }

  // ── Filter ────────────────────────────────────────────
  resetFilter() {
    this.departmentFilter = 0;
    this.jobTitleFilter = 0;
    this.jobTypeFilter = 0;
    this.empTypeFilter = 0;
    this.empTableObj?.draw();
  }

  onChangeDept() {
    this.empTableObj?.draw();
  }
  onChangeJobtitle() {
    this.empTableObj?.draw();
  }
  onChangeJobType() {
    this.empTableObj?.draw();
  }
  onChangeEmpType() {
    this.empTableObj?.draw();
  }

  // ── DataTable ─────────────────────────────────────────
  initEmpGrid() {
    if (!this.empGrid?.nativeElement) return;
    const that = this;

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
        data: function (d: any) {
          d.businessUnitNo = that.departmentFilter;
          d.jobtitleNo = that.jobTitleFilter;
          d.jobTypeNo = that.jobTypeFilter;
          d.empTypeNo = that.empTypeFilter;
          return d;
        },
        beforeSend: function (xhr: any) {
          xhr.setRequestHeader(
            'Authorization',
            'bearer ' + that.authService.getAccessToken(),
          );
          xhr.setRequestHeader('Content-Type', 'application/json');
        },
        dataSrc: function (response: any) {
          response.draw = response.obj.draw;
          response.recordsTotal = response.obj.recordsTotal;
          response.recordsFiltered = response.obj.recordsFiltered;
          return response.obj.data;
        },
        error: function (req: any) {
          console.error('Grid Error', req.responseText);
        },
      },
      order: [[0, 'asc']],
      columns: [
        {
          title: 'Employee',
          data: 'empName',
          render: (_: any, __: any, row: any) => {
            const photo = row.photo
              ? `data:image/jpeg;base64,${row.photo}`
              : `assets/images/profile-placeholder.jpg`;
            return `<div class="emp-cell">
              <img src="${photo}" class="emp-avatar-img" />
              <div>
                <div class="emp-name">${row.empName || ''}</div>
                <div class="emp-meta">${row.empId || ''}</div>
              </div>
            </div>`;
          },
        },
        { title: 'Emp ID', data: 'empId', width: '100px' },
        { title: 'Department', data: 'buNo', width: '130px' },
        { title: 'Job Title', data: 'jobtitleNo', width: '130px' },
        {
          title: 'Join Date',
          data: 'joinDate',
          width: '100px',
          render: (data: any) =>
            data ? moment(new Date(data)).format('DD-MM-YYYY') : '—',
        },
        {
          title: 'Status',
          data: 'activeStat',
          width: '80px',
          render: (data: number) =>
            data === 1
              ? '<span class="emp-status emp-status--active">Active</span>'
              : '<span class="emp-status emp-status--inactive">Inactive</span>',
        },
      ],
      select: true,
      responsive: true,
      autoWidth: false,
      rowCallback: (row: Node, data: any) => {
        $('td', row)
          .off('click')
          .on('click', () => {
            if ($(row).hasClass('selected-row')) {
              $(row).removeClass('selected-row');
              this.selectedPersonnel = null;
              this.singlePersonnel = null;
            } else {
              $(row).closest('tbody').find('tr').removeClass('selected-row');
              $(row).addClass('selected-row');
              this.selectedPersonnel = data;
              if (data.joinDate) data.joinDate = new Date(data.joinDate);
              if (data.dob) data.dob = new Date(data.dob);
              this.getEditPersonnel(data.id);
            }
          });
        return row;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.bsModalRef) this.bsModalRef.hide();
  }
}
