import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { SystemConfig } from '../../_coreSecurity/models/system-config.model';
import { SystemConfigService } from '../../_coreSecurity/services/system-config.service';
import { AddSystemConfigComponent } from './add-system-config/add-system-config.component';

@Component({
  selector: 'app-system-config',
  templateUrl: './system-config.component.html',
  styleUrls: ['./system-config.component.css'],
  standalone: false,
})
export class SystemConfigComponent implements OnInit {
  bsModalRef!: BsModalRef;
  systemConfigTable: any;
  systemConfigTableObj: any;
  selectedSystemConfig!: any;
  selectedSystemConfigId!: number;
  @ViewChild('systemConfigGrid')
  systemConfigGrid!: { nativeElement: any };
  activeInactiveFlag: string | null = 'A';
  disableButton: string = 'Disable';

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private toastr: ToastrService,
    private systemConfigService: SystemConfigService,
  ) {}

  ngOnInit() {
    this.initSystemConfigGrid();
  }

  ngAfterViewInit(): void {
    this.initSystemConfigGrid();
  }

  addConfig() {
    const initialState = {
      title: 'Add System Config',
    };
    this.bsModalRef = this.modalService.show(AddSystemConfigComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result == true) {
        this.systemConfigTableObj.draw();
      }
    });
  }
  editConfig() {
    if (!this.selectedSystemConfig) {
      this.toastr.warning('Please select a record to Edit');
    } else {
      const initialState = {
        title: 'Edit System Config',
        systemConfig: this.selectedSystemConfig,
      };
      this.bsModalRef = this.modalService.show(AddSystemConfigComponent, {
        class: 'modal-md base-modal',
        initialState,
        backdrop: 'static',
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          this.systemConfigTableObj.draw();
        }
      });
    }
  }
  deleteConfig(): void {
    if (!this.selectedSystemConfig) {
      this.toastr.warning('Please select a record to Delete');
    } else {
      const initialState = { title: 'Do you want to Delete?' };
      this.bsModalRef = this.modalService.show(ConfirmationDialog, {
        initialState,
        class: '',
      });
      this.bsModalRef.content.onClose.subscribe((result: any) => {
        if (result) {
          this.systemConfigService
            .deleteConfig(this.selectedSystemConfig.id)
            .subscribe((res: { message: string | undefined }) => {
              res.message
                ? this.toastr.success(res.message)
                : this.toastr.warning(res.message);
              this.systemConfigTableObj.draw();
            });
        }
      });
    }
  }
  disableOrEnableConfig(): void {
    if (!this.selectedSystemConfig) {
      this.toastr.warning('Please select a config first.');
    } else {
      const initialState = {
        title: 'Do you want to ' + this.disableButton + ' this config?',
      };
      this.bsModalRef = this.modalService.show(ConfirmationDialog, {
        initialState,
        class: '',
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          console.log('flag:', this.activeInactiveFlag);
          this.selectedSystemConfig.activeStatus =
            this.activeInactiveFlag == 'I' ? 1 : 0;
          this.systemConfigService
            .updateConfig(this.selectedSystemConfig)
            .subscribe((res: { message: string | undefined }) => {
              console.log('reees:', res);
              res.message
                ? this.toastr.success(res.message)
                : this.toastr.warning(res.message);
              this.systemConfigTableObj.draw();
            });
        }
      });
    }
  }

  initSystemConfigGrid() {
    let that = this;
    this.systemConfigTable = $(this.systemConfigGrid?.nativeElement);
    this.systemConfigTableObj = this.systemConfigTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: {
        url:
          environment.baseUrl +
          environment.authApiUrl +
          '/api/system-config/gridList',
        type: 'GET',
        data: function (d: any) {
          d.customSearch = d.search.value;
          d.activeInactiveFlag = that.activeInactiveFlag;
          return d;
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
          console.log('Data Grid Rendering Error', request.responseText);
        },
      },
      order: [[0, 'desc']],
      columns: [
        {
          title: 'SC No.',
          data: 'id',
          className: 'dt-left',
        },
        {
          title: 'Config Key',
          data: 'configKey',
          name: 'configKey',
        },
        {
          title: 'Config Value',
          data: 'configValue',
          name: 'configValue',
        },
        {
          title: 'Config Group',
          data: 'configGroup',
          name: 'configGroup',
        },

        {
          title: 'Is Editable',
          data: 'isEditable',
          render: (data: number) => {
            if (data == 1) {
              return '<span class="badge rounded-pill bg-success-subtle px-3 py-2 text-success">Yes</span>';
            } else {
              return '<span class="badge rounded-pill bg-danger-subtle px-3 py-2 text-danger">No</span>';
            }
          },
        },

        {
          title: 'Status',
          data: 'activeStatus',
          render: (data: number) => {
            if (data == 1) {
              return '<span class="badge rounded-pill bg-success-subtle px-3 py-2 text-success">Active</span>';
            } else {
              return '<span class="badge rounded-pill bg-danger-subtle px-3 py-2 text-danger">Inactive</span>';
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
          this.selectedSystemConfig = data.id;

          if (self.selectedSystemConfig) {
            self.selectedSystemConfig = null;
          }
          self.selectedSystemConfig = data;

          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
          }
          this.systemConfigService
            .getSingleConfig(data.id)
            .subscribe((res: SystemConfig) => {
              this.selectedSystemConfig = res;
            });
          console.log('Selected config ', this.selectedSystemConfig);
        });
        return row;
      },
    });
  }

  statusCheck(status: string) {
    this.activeInactiveFlag = status;
    if (this.activeInactiveFlag == 'A') {
      this.disableButton = 'Disable';
    } else {
      this.disableButton = 'Enable';
    }
    this.systemConfigTableObj.draw();
  }
}
