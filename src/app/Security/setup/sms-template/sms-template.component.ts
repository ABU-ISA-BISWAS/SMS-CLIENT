import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { SmsTemplateService } from '../../_coreSecurity/services/sms-template.service';
import { AddSmsTemplateComponent } from './add-sms-template/add-sms-template.component';

@Component({
  selector: 'app-sms-template',
  templateUrl: './sms-template.component.html',
  styleUrls: ['./sms-template.component.css'],
  standalone: false,
})
export class SmsTemplateComponent implements OnInit, AfterViewInit {
  bsModalRef!: BsModalRef;
  smsTable: any;
  smsTableObj: any;
  selectedTemplate: any;

  @ViewChild('smsGrid') smsGrid!: { nativeElement: any };

  activeInactiveFlag: string | null = 'A';
  disableButton: string = 'Disable';

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private smsTemplateService: SmsTemplateService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.initGrid();
  }

  addTemplate() {
    const initialState = { title: 'Add SMS Template' };
    this.bsModalRef = this.modalService.show(AddSmsTemplateComponent, {
      class: 'modal-lg base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) this.smsTableObj.draw();
    });
  }

  editTemplate() {
    if (!this.selectedTemplate) {
      this.toastr.warning('Please select a record to Edit');
      return;
    }
    const initialState = {
      title: 'Edit SMS Template',
      template: this.selectedTemplate,
    };
    this.bsModalRef = this.modalService.show(AddSmsTemplateComponent, {
      class: 'modal-lg base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) this.smsTableObj.draw();
    });
  }

  deleteTemplate(): void {
    if (!this.selectedTemplate) {
      this.toastr.warning('Please select a record to Delete');
      return;
    }
    const initialState = {
      title: 'Do you want to Delete this SMS Template?',
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.smsTemplateService.delete(this.selectedTemplate.id).subscribe({
          next: (res: any) => {
            res.success
              ? this.toastr.success(res.message || 'Deleted successfully!')
              : this.toastr.warning(res.message);
            this.selectedTemplate = null;
            this.smsTableObj.draw();
          },
          error: () => this.toastr.error('Something went wrong.'),
        });
      }
    });
  }

  disableOrEnable(): void {
    if (!this.selectedTemplate) {
      this.toastr.warning('Please select a record first.');
      return;
    }
    const initialState = {
      title: `Do you want to ${this.disableButton} this Template?`,
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.selectedTemplate.activeStatus =
          this.activeInactiveFlag === 'I' ? 1 : 0;
        this.smsTemplateService.update(this.selectedTemplate).subscribe({
          next: (res: any) => {
            res.message
              ? this.toastr.success(res.message)
              : this.toastr.warning(res.message);
            this.smsTableObj.draw();
          },
        });
      }
    });
  }

  initGrid() {
    const that = this;
    this.smsTable = $(this.smsGrid?.nativeElement);
    this.smsTableObj = this.smsTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url:
          environment.baseUrl +
          environment.authApiUrl +
          '/api/sms-template/gridList',
        type: 'GET',
        data: function (d: any) {
          d.customSearch = d.search.value;
          d.activeInactiveFlag = that.activeInactiveFlag;
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
        error: function (request: any) {
          console.log('Grid Error', request.responseText);
        },
      },
      order: [[0, 'desc']],
      columns: [
        { title: 'Sl.', data: 'id', className: 'dt-left' },
        { title: 'Template Code', data: 'templateCode' },
        { title: 'Template Name', data: 'templateName' },
        {
          title: 'Type',
          data: 'templateType',
          render: (data: string) =>
            `<span class="badge rounded-pill bg-info-subtle px-3 py-2 text-info">${data}</span>`,
        },
        {
          title: 'Template Body',
          data: 'templateBody',
          render: (data: string) =>
            `<span title="${data}">${data.length > 60 ? data.substring(0, 60) + '...' : data}</span>`,
        },
        {
          title: 'Status',
          data: 'activeStatus',
          render: (data: number) =>
            data === 1
              ? '<span class="badge rounded-pill bg-success-subtle px-3 py-2 text-success">Active</span>'
              : '<span class="badge rounded-pill bg-danger-subtle px-3 py-2 text-danger">Inactive</span>',
        },
      ],
      select: true,
      responsive: true,
      autoWidth: true,
      rowCallback: (row: Node, data: any) => {
        $('td', row).off('click');
        $('td', row).on('click', () => {
          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');
            this.selectedTemplate = null;
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
            this.smsTemplateService.getSingle(data.id).subscribe((res: any) => {
              this.selectedTemplate = res;
            });
          }
        });
        return row;
      },
    });
  }

  statusCheck(status: string) {
    this.activeInactiveFlag = status;
    this.disableButton = status === 'A' ? 'Disable' : 'Enable';
    this.smsTableObj.draw();
  }
}
