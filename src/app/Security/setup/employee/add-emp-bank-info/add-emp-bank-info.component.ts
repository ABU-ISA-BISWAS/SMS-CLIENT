import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AuthService } from '../../../../auth/_service/auth-service';
import { EmployeeBankInfoModel } from '../../../_coreSecurity/models/employee-bank-info.model';
import { EmployeeModel } from '../../../_coreSecurity/models/employee.model';
import { BankInfoService } from '../../../_coreSecurity/services/bank-info-service';
import { EmployeeBankInfoService } from '../../../_coreSecurity/services/employee-bank-info.service';
import { environment } from '../../../../../environments/environment';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-emp-bank-info',
  templateUrl: './add-emp-bank-info.component.html',
  styleUrls: ['./add-emp-bank-info.component.css'],
  standalone: false,
})
export class AddEmpBankInfoComponent implements OnInit, AfterViewInit {


  isShowDatagrid: boolean = true;
  employee: EmployeeModel = new EmployeeModel();

  bankAccountTypeList: any[] = [];
  bankInfoList: any[] = [];

  selectedBank: any = null;

  @ViewChild('hrEmpBankInfoGrid')
  hrEmpBankInfoGrid!: { nativeElement: any; };
  hrEmpBankInfoTable: any;
  hrEmpBankInfoGridObj: any;

  addEditTitle: string = 'Add'

  title: string = "";
  onClose!: Subject<boolean>;
  selectedEmpBankInfo: any;
  employeeObj: any;
  presSaveBtn!: boolean;
  employeeBankInfoModel: EmployeeBankInfoModel = new EmployeeBankInfoModel();
  isSaving: boolean = false;
  constructor(private bankInfoService: BankInfoService,
    private employeeBankInfoService: EmployeeBankInfoService,
    public authService: AuthService,
    public bsModalRef: BsModalRef,
    public bsModalRefpres: BsModalRef,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.getBankAcceDataList();
    this.getBankInfoList();

  }

  ngAfterViewInit() {
    this.initHrBankInfoGridTable();
  }

  getBankAcceDataList(): any {
    const reqObj: any = {};
    this.bankInfoService.findBankAccountTypeList(reqObj).subscribe(
      resp => {
        if (resp.success && resp.items) {
          this.bankAccountTypeList = resp.items;
          console.log('Bank Account .', this.bankAccountTypeList);
        } else {
          console.log('Bank Account Type not found.');
        }
      },
      err => {
        console.log('HTTP Error for Bank Account Type Data.');
      })
  }

  getBankInfoList(): any {

    const reqObj: any = {};
    this.bankInfoService.findBankInfoList(reqObj).subscribe(
      resp => {
        if (resp.success && resp.items) {
          this.bankInfoList = resp.items;
          console.log('Bank list .', this.bankInfoList);
        } else {
          console.log('Bank Info List not found.');
        }
      },
      err => {
        console.log('HTTP Error for Bank Info List Data.');
      })
  }

  selectBankName(data: number) {
    console.log('data', data);

    if (data) {
      this.employeeBankInfoModel.bankNo = data;
    }
  }

  initHrBankInfoGridTable(): any {
    let that = this;
    this.hrEmpBankInfoTable = $(this.hrEmpBankInfoGrid.nativeElement);
    this.hrEmpBankInfoGridObj = this.hrEmpBankInfoTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: {
        url: environment.baseUrl + environment.authApiUrl + '/api/employee-bank-info/gridList',
        type: "GET",

        data: function (sendData: { empNo: any; }) {
          sendData.empNo = that.employeeObj.id;
        },
        beforeSend: function (xhr: { setRequestHeader: (arg0: string, arg1: string) => void; }) {
          xhr.setRequestHeader('Authorization', "bearer " + that.authService.getAccessToken());
          xhr.setRequestHeader('Content-Type', "application/json");
        },
        dataSrc: function (response: { draw: any; obj: { draw: any; recordsTotal: any; recordsFiltered: any; data: any; }; recordsTotal: any; recordsFiltered: any; }) {
          response.draw = response.obj.draw;
          response.recordsTotal = response.obj.recordsTotal;
          response.recordsFiltered = response.obj.recordsFiltered;
          return response.obj.data;
        },
        error: function (request: { responseText: any; }) {
          console.log("request.responseText", request.responseText);
        }
      },

      "order": [[0, "desc"]],

      columns: [
        {
          'visible': false,
          data: 'ssModifiedOn',
          name: 'ssModifiedOn'
        },
        {
          'visible': false,
          data: 'id',
          name: 'id'
        },
        {
          title: 'SL',
          data: 'ssModifiedOn',
          render: function (data: any, type: any, row: any, meta: { row: number; }) {
            return '<span>' + (meta.row + 1) + '</span>'
          }
        },
        {
          title: 'Bank No',
          data: 'bankNo',
          name: 'bankNo'
        },

        {
          title: 'Employee No',
          data: 'empNo',
          name: 'empNo'
        },

        {
          title: 'Bank Account No',
          data: 'bankAccountNo',
          name: 'bankAccountNo'
        },

        {
          title: 'Bank Branch',
          data: 'bankBranch',
          name: 'bankBranch'
        },

        {
          title: 'Swift Code',
          data: 'bankAccountSwiftcode',
          name: 'bankAccountSwiftcode'
        },

        {
          orderable: false,
          title: 'Default Flag',
          render: (data: any, type: any, row: { defaultFlag: number; }) => {
            let resState: string;
            if (row.defaultFlag == 1) {
              return resState = '<i class="far fa-check-square checkIcon"></i>'
            } else {
              return resState = ''
            }
          }
        },
        {
          orderable: false,
          title: 'Active Status',
          render: (data: any, type: any, row: { activeStatus: number; }) => {
            let resState: string;
            if (row.activeStatus == 1) {
              return resState = '<i class="far fa-check-square checkIcon"></i>'
            } else {
              return resState = ''
            }
          }
        },

      ],
      responsive: true,
      select: true,
      rowCallback: (row: Node, data: any | Object) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          self.selectedEmpBankInfo = data;
          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');

          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');

          }
        })
        $(row).bind('click', () => {
          if ($(row).hasClass("selected")) {
            self.selectedEmpBankInfo;
          } else {
            self.selectedEmpBankInfo = data;
            console.log("...unselected data", data);
          }
          console.log("...selected selectedBankInfo", self.selectedEmpBankInfo);
        });
        return row;
      },

    });
  }

  onShow() {
    this.isShowDatagrid = false;
  }

  onAdd() {
    this.selectedEmpBankInfo = {};
    this.addEditTitle = 'Add'
    this.onShow();
  }

  onEdit(): void {
    if (!this.selectedEmpBankInfo || !this.selectedEmpBankInfo.id) {
      this.toastr.warning('Please Select Employee Bank Information.');
      return;
    }
    this.addEditTitle = 'Update';
    this.employeeBankInfoModel = this.selectedEmpBankInfo;
    this.onShow();
  }

  onSaveOrUpdate(): void {
    this.isSaving = true;
    this.employeeBankInfoModel.empNo = this.employeeObj.id;

    if (!this.employeeBankInfoModel.bankNo) {
      this.isSaving = false;
      this.toastr.warning('Please Select Bank Name!');
      return;
    }
    if (!this.employeeBankInfoModel.bankBranch) {
      this.isSaving = false;
      this.toastr.warning('Please Enter Branch Name!');
      return;
    }
    if (!this.employeeBankInfoModel.bankAccountNo) {
      this.isSaving = false;
      this.toastr.warning('Please Enter Bank Account No.');
      return;
    }

    if (this.selectedEmpBankInfo && this.selectedEmpBankInfo.id) {
      this.onUpdate(this.employeeBankInfoModel);
    } else {
      this.onSave(this.employeeBankInfoModel);
    }
  }

  onSave(employeeBankInfoModel: EmployeeBankInfoModel): void {
    this.employeeBankInfoService.saveEmpBankInfo(employeeBankInfoModel).pipe(
      finalize(() => {
        this.isSaving = false;
      })
    ).subscribe({
      next: (res: { success: boolean; message?: string }) => {
        if (res.success) {
          this.toastr.success(res.message || 'Employee bank info saved successfully!');
          this.onHide();
        } else {
          this.toastr.warning(res.message || 'Failed to save employee bank info!');
        }
      },
      error: (err) => {
        this.toastr.error('Something went wrong while saving. Please check your connection or try again.');
      }
    });
  }

  onUpdate(employeeBankInfoModel: EmployeeBankInfoModel): void {
    this.employeeBankInfoService.updateEmpBankInfo(employeeBankInfoModel).pipe(
      finalize(() => {
        this.isSaving = false;
      })
    ).subscribe({
      next: (res: { success: boolean; message?: string }) => {
        if (res.success) {
          this.toastr.success(res.message || 'Employee bank info updated successfully!');
          this.onHide();
        } else {
          this.toastr.warning(res.message || 'Failed to update employee bank info!');
        }
      },
      error: (err) => {
        this.toastr.error('Something went wrong while updating. Please check your connection or try again.');
      }
    });
  }

  setDefault() {

    if (!this.selectedEmpBankInfo || !this.selectedEmpBankInfo.id) {
      this.toastr.warning('Please Select Employee Bank Information.');
      return;
    }
    let empNo = this.employeeObj.id;
    let id = this.selectedEmpBankInfo.id;
    this.employeeBankInfoService.setDefault(id, empNo).subscribe(res => {
      if (res) {
        this.toastr.success(res.message);
        this.onHide();
      }
    })
  }
  onHide() {
    this.onReset();
  }

  onReset() {
    this.isShowDatagrid = true;
    this.employeeBankInfoModel = new EmployeeBankInfoModel();
    this.hrEmpBankInfoGridObj.draw();
  }

}
