import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { DepartmentService } from '../../_coreSecurity/services/department.service';
import { AddDepartmentModalComponent } from './add-department-modal/add-department-modal.component';

@Component({
  selector: 'app-department-new',
  templateUrl: './department-new.component.html',
  styleUrls: ['./department-new.component.css'],
  standalone: false,
})
export class DepartmentNewComponent implements OnInit {
  @ViewChild('departmentGridTable') departmentGridTable!: {
    nativeElement: any;
  };
  bsModalRef!: BsModalRef;

  departmentFlagGrid: any;
  departmentGridObj: any;
  selectedDepartment: any;

  radiobutton = '1';
  depListStatus: number = 1;

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private modalService: BsModalService,
    private departmentService: DepartmentService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initDepartmentGridTable();
  }

  initDepartmentGridTable(): any {
    let that = this;
    this.departmentFlagGrid = $(this.departmentGridTable.nativeElement);
    this.departmentGridObj = this.departmentFlagGrid.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url:
          environment.baseUrl +
          environment.authApiUrl +
          '/api/employee/dept/gridList',
        type: 'GET',

        data: function (sendData: any) {
          sendData.filterFlag = that.radiobutton;
          sendData.statusFlag = that.depListStatus;
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

        error: function (request: any) {
          console.log('request.responseText', request.responseText);
        },
      },

      order: [[0, 'desc']],
      columns: [
        {
          title: 'Department ID',
          data: 'buId',
          name: 'buId',
        },
        {
          title: 'Department Name',
          data: 'buName',
          name: 'buName',
        },

        {
          title: 'Active Status',
          data: 'activeStatus',
          name: 'activeStatus',
          render: (data: any) => {
            return data == 1 ? 'Active' : 'Inactive';
          },
        },
      ],
      responsive: true,
      select: true,

      rowCallback: (row: Node, data: any | Object) => {
        const self = this;
        $(row).bind('click', () => {
          if ($(row).hasClass('selected')) {
            self.selectedDepartment = '';
          } else {
            self.selectedDepartment = data;
          }
        });
        return row;
      },
    });
  }

  onChangeRadioButton() {
    this.departmentGridObj.draw();
  }

  addDepartment() {
    const initialState = {
      title: 'Add Department',
    };
    this.bsModalRef = this.modalService.show(AddDepartmentModalComponent, {
      class: 'modal-lg',
      initialState,
    });
    this.bsModalRef.content.onClose.subscribe((result: any) => {
      if (result) {
        this.departmentGridObj.draw();
      }
    });
  }

  editDepartment() {
    if (this.selectedDepartment) {
      const initialState = {
        title: 'Edit Department',
        department: this.selectedDepartment,
      };
      this.bsModalRef = this.modalService.show(AddDepartmentModalComponent, {
        class: 'modal-lg',
        initialState,
      });
      this.bsModalRef.content.onClose.subscribe((result: any) => {
        if (result) {
          this.departmentGridObj.draw();
        }
      });
    } else {
      this.toastr.warning('Please, Select a row');
    }
  }

  deleteDepartment() {
    if (this.selectedDepartment) {
      const initialState = { title: 'Do you want to Delete?' };
      this.bsModalRef = this.modalService.show(ConfirmationDialog, {
        initialState,
        class: 'modal-sm',
      });
      this.bsModalRef.content.onClose.subscribe((result: any) => {
        if (result) {
          this.departmentService
            .deleteDepartment(this.selectedDepartment.id.toString())
            .subscribe(
              (res: any) => {
                this.toastr.success('', 'Delete Successfull');
                this.departmentGridObj.draw();
                this.selectedDepartment = '';
              },
              (err: any) => {
                this.toastr.warning('', 'Error occured on Department Delete');
              },
            );
        }
      });
    } else {
      this.toastr.warning('Please select a Department');
    }
  }

  onChangeStatus() {
    console.log(this.depListStatus);
    this.departmentGridObj.draw();
  }
  ngOnDestroy(): void {
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
  }
}
