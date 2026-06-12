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
import { EmployeeModel } from '../../_coreSecurity/models/employee.model';
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

  jobTypeFilter: string = '';
  empTypeFilter: string = '';

  // ── Form dropdowns ────────────────────────────────────
  genderList: any[] = [];
  maritalStatusList: any[] = [];
  bloodGroupList: any[] = [];
  religionList: any[] = [];
  districtList: any[] = [];
  countryList: any[] = [];
  guardianRelationList: any[] = [];
  doctorName: any;

  // ── View / Step ───────────────────────────────────────
  isFormVisible = false;
  formMode: 'add' | 'edit' = 'add';

  currentStep = 1;
  totalSteps = 3;

  steps: {
    no: number;
    key: 'personalInfo' | 'officialInfo' | 'address';
    label: string;
    icon: string;
  }[] = [
    { no: 1, key: 'personalInfo', label: 'Basic Information', icon: 'fa-user' },
    {
      no: 2,
      key: 'officialInfo',
      label: 'Other Information',
      icon: 'fa-briefcase',
    },
    {
      no: 3,
      key: 'address',
      label: 'Address Details',
      icon: 'fa-map-marker-alt',
    },
  ];

  // ── Shared employee data object (single source of truth) ─
  // Tab components ও এই same object এ bind করবে
  sharedEmployee: EmployeeModel = new EmployeeModel();

  // ── State ─────────────────────────────────────────────
  isSaving = false;

  imgFile!: File;

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private toastr: ToastrService,
    private empService: EmployeeService,
  ) {}

  ngOnInit() {
    this.getMaritalStatus();
    this.getGender();
    this.getBloodGroup();
    this.getGuardianRelation();
    this.getDeptName();
    this.getJobTitle();
    this.getJobType();
    this.getEmpType();

    this.getReligion();
    this.getDistrict();

    this.countryList = [{ id: 1, countryName: 'Bangladesh' }];
  }

  ngAfterViewInit(): void {
    this.initEmpGrid();
  }

  // ── Dropdown loaders ──────────────────────────────────
  getDeptName() {
    this.empService
      .getDeptName()
      .subscribe({ next: (r: any) => (this.hrBuList = r || []) });
  }
  getJobTitle() {
    this.empService
      .getJobTitle()
      .subscribe({ next: (r: any) => (this.hrJobTitleList = r || []) });
  }
  getJobType() {
    this.empService
      .getJobType()
      .subscribe({ next: (r: any) => (this.jobTypeList = r || []) });
  }
  getEmpType() {
    this.empService
      .getEmpType()
      .subscribe({ next: (r: any) => (this.empTypeList = r || []) });
  }
  getMaritalStatus() {
    this.empService
      .getMaritalStatus()
      .subscribe({ next: (r: any) => (this.maritalStatusList = r || []) });
  }
  getGender() {
    this.empService
      .getGender()
      .subscribe({ next: (r: any) => (this.genderList = r || []) });
  }
  getBloodGroup() {
    this.empService
      .getBloodGroup()
      .subscribe({ next: (r: any) => (this.bloodGroupList = r || []) });
  }
  getReligion() {
    this.empService
      .getReligion()
      .subscribe({ next: (r: any) => (this.religionList = r || []) });
  }
  getDistrict() {
    this.empService
      .getDistrict()
      .subscribe({ next: (r: any) => (this.districtList = r || []) });
  }
  getGuardianRelation() {
    this.empService
      .getGuardianRelation()
      .subscribe({ next: (r: any) => (this.guardianRelationList = r || []) });
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
    this.currentStep = 1;
    this.isSaving = false;

    // Reset shared model
    this.sharedEmployee = new EmployeeModel();

    // Edit: patch shared model with selected employee data
    if (mode === 'edit' && this.singlePersonnel) {
      Object.assign(this.sharedEmployee, this.singlePersonnel);
      // Date fix
      if (this.sharedEmployee.joinDate) {
        this.sharedEmployee.joinDate = moment(
          new Date(this.sharedEmployee.joinDate),
        ).toDate();
      }
      if (this.sharedEmployee.dob) {
        this.sharedEmployee.dob = moment(
          new Date(this.sharedEmployee.dob),
        ).toDate();
      }
    } else {
      // Add: default join date
      this.sharedEmployee.joinDate = new Date();
    }

    this.isFormVisible = true;

    if (this.empTableObj) {
      this.empTableObj.destroy();
      this.empTableObj = null;
    }
  }

  closeForm() {
    this.isFormVisible = false;
    this.sharedEmployee = new EmployeeModel();
    this.isSaving = false;
    setTimeout(() => this.initEmpGrid(), 50);
  }

  // ── Step Navigation ───────────────────────────────────
  get activeStepKey(): 'personalInfo' | 'officialInfo' | 'address' {
    return this.steps[this.currentStep - 1].key;
  }

  goToStep(stepNo: number) {
    if (stepNo > this.currentStep) {
      // Only allow forward navigation if current step validates
      if (!this.validateStep(this.currentStep)) return;
    }
    this.currentStep = stepNo;
  }

  nextStep() {
    if (!this.validateStep(this.currentStep)) return;
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  validateStep(step: number): boolean {
    if (step === 1) {
      if (!this.sharedEmployee.fname) {
        this.toastr.warning("Employee name can't be empty!");
        return false;
      }
      if (!this.sharedEmployee.empId) {
        this.toastr.warning("Employee ID can't be empty!");
        return false;
      }
      if (!this.sharedEmployee.buNo) {
        this.toastr.warning("Department can't be empty!");
        return false;
      }
      if (!this.sharedEmployee.jobtitleNo) {
        this.toastr.warning("Job Title can't be empty!");
        return false;
      }
      if (!this.sharedEmployee.gender) {
        this.toastr.warning("Gender can't be empty!");
        return false;
      }
      if (!this.sharedEmployee.joinDate) {
        this.toastr.warning("Join Date can't be empty!");
        return false;
      }
    }
    return true;
  }

  // ── Save ──────────────────────────────────────────────
  saveEmployee() {
    if (!this.validateStep(1)) {
      this.currentStep = 1;
      return;
    }

    this.isSaving = true;
    const payload: any = { ...this.sharedEmployee };
    payload.activeStat = payload.activeStat ? 1 : 0;

    const req$ = payload.id
      ? this.empService.updateEmployeeWithImage(payload, this.imgFile)
      : this.empService.saveEmployeeWithImage(payload, this.imgFile);

    req$.subscribe({
      next: (res: { success: boolean; message?: string }) => {
        this.isSaving = false;
        if (res.success) {
          this.toastr.success(
            res.message ||
              (payload.id
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

  // ── Get single (for edit) ─────────────────────────────
  getEditPersonnel(empNo: any) {
    this.empService.getSingleEmployee(empNo).subscribe((res: any) => {
      this.singlePersonnel = res;
    });
  }

  // ── Filter ────────────────────────────────────────────
  resetFilter() {
    this.departmentFilter = 0;
    this.jobTitleFilter = 0;
    this.jobTypeFilter = '';
    this.empTypeFilter = '';
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
          d.jobTypeName = that.jobTypeFilter;
          d.employeeTypeName = that.empTypeFilter;
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
          title: 'Employee Name',
          data: 'empName',
          naem: 'empName',
        },
        { title: 'Emp ID', data: 'empId' },

        {
          title: 'Department',
          data: 'buNo',
          className: 'dt-left',
          render: (data: any) => {
            const dept = this.hrBuList.find((x) => x.id === data);
            return dept ? dept.deptName : '';
          },
        },

        {
          title: 'Job Title',
          data: 'jobtitleNo',
          className: 'dt-left',
          render: (data: any) => {
            const job = this.hrJobTitleList.find((x) => x.id === data);
            return job ? job.desigName : '';
          },
        },
        {
          title: 'Join Date',
          data: 'joinDate',

          render: (data: any) =>
            data ? moment(new Date(data)).format('DD-MM-YYYY') : '—',
        },
        {
          title: 'Status',
          data: 'activeStat',

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

  fileImmite(imgFiledata: any) {
    this.imgFile = imgFiledata;
    console.log('imgFile', this.imgFile);
  }

  ngOnDestroy(): void {
    if (this.bsModalRef) this.bsModalRef.hide();
  }

  get stepProgress(): number {
    return ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
  }
}
