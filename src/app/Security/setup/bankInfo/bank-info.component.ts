import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { BankInfoModel } from '../../_coreSecurity/models/bank-info.model';
import { BankInfoService } from '../../_coreSecurity/services/bank-info-service';
import { AddBankInfoComponent } from './add-bank-info/add-bank-info.component';

@Component({
  selector: 'app-bank-info',
  templateUrl: './bank-info.component.html',
  styleUrls: ['./bank-info.component.css'],
  standalone: false,
})
export class BankInfoComponent implements OnInit {
  bsModalRef!: BsModalRef;
  bankTable: any;
  bankTableObj: any;
  activeStatus = '1';
  selectedBankInfo!: BankInfoModel;
  @ViewChild('bankInfoGrid') bankInfoGrid!: { nativeElement: any };

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private bankInfoService: BankInfoService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initBankInfoGrid();
  }
  // Data Grid
  initBankInfoGrid() {
    let that = this;
    this.bankTable = $(this.bankInfoGrid.nativeElement);
    this.bankTableObj = this.bankTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: {
        url:
          environment.baseUrl +
          environment.authApiUrl +
          '/api/bank-info/gridList',
        type: 'GET',
        beforeSend: function (xhr: any) {
          xhr.setRequestHeader(
            'Authorization',
            'bearer ' + that.authService.getAccessToken(),
          );
          xhr.setRequestHeader('Content-Type', 'application/json');
        },
        data: function (sendData: any) {
          sendData.activeStatus = that.activeStatus;
        },
        dataSrc: function (response: any) {
          response.draw = response.obj.draw;
          response.recordsTotal = response.obj.recordsTotal;
          response.recordsFiltered = response.obj.recordsFiltered;
          return response.obj.data;
        },
        error: function (request: any) {
          console.log('Data Grid Rendering Error', request.responseText);
        },
      },
      order: [[0, 'desc']],
      columns: [
        {
          visible: false,
          data: 'ssModifiedOn',
          name: 'ssModifiedOn',
        },
        {
          title: 'Bank Id.',
          data: 'id',
        },
        {
          title: 'Bank Name',
          data: 'bankName',
          name: 'bankName',
        },
        {
          title: 'Bank Account Type',
          data: 'bankAccountType',
          render: (data: any) => {
            if (data === 'E') {
              return 'Employee Salary';
            } else if (data === 'C') {
              return 'Company';
            } else {
              return data;
            }
          },
        },
        {
          title: 'Active Status',
          width: '40px',
          data: 'activeStatus',
          className: 'text-center',
          render: (data: any) => {
            if (data == '1') {
              return '<i class="fas fa-check text-success"></i>';
            } else {
              return '';
            }
          },
        },
      ],
      select: true,
      responsive: true,
      autoWidth: true,
      rowCallback: (row: Node, data: any | Object) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          // console.log(data);
          self.selectedBankInfo = data;
        });
        $(row).bind('click', () => {
          if ($(row).hasClass('selected')) {
            self.selectedBankInfo;
          } else {
            self.selectedBankInfo = data;
          }
          console.log('...selected selectedBankInfo', self.selectedBankInfo);
        });
        return row;
      },
    });
  }

  onChangeRadioButton() {
    this.activeStatus;
    this.bankTableObj.draw();
  }

  addBankInfo() {
    const initialState = {
      title: 'Add Bank Info',
    };
    this.bsModalRef = this.modalService.show(AddBankInfoComponent, {
      class: 'modal-md',
      initialState,
    });
    this.bsModalRef.content.onClose.subscribe((result: any) => {
      if (result == true) {
        this.bankTableObj.draw();
      }
    });
  }
  editBankInfo() {
    console.log('selectedBankInfo', this.selectedBankInfo);

    if (!this.selectedBankInfo.id) {
      this.toastr.warning('Please select a record to Edit');
    } else {
      const initialState = {
        title: 'Edit Bank Info',
        bankInfoModel: this.selectedBankInfo,
      };
      this.bsModalRef = this.modalService.show(AddBankInfoComponent, {
        class: 'modal-md',
        initialState,
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          this.bankTableObj.draw();
        }
      });
    }
  }
  deleteFeature(): void {
    // if (!this.selectedBankInfo) {
    //   this.toastr.warning("Please select a record to Delete")
    // }
    // else {
    //   const initialState = { title: "Do you want to Delete?" };
    //   this.bsModalRef = this.modalService.show(ConfirmationDialogComponent, { initialState, class: 'modal-sm' });
    //   this.bsModalRef.content.onClose.subscribe(result => {
    //     if (result) {
    //       this.featureService.deleteFeature(this.selectedBankInfo.id).subscribe(res => {
    //         res.message ? this.toastr.success(res.message) : this.toastr.warning(res.message);
    //         this.featureTableObj.draw();
    //       })
    //     }
    //   })
    // }
  }
}
