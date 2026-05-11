import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { GroupVersion } from '../../_coreSecurity/models/group-version.model';
import { GroupVersionService } from '../../_coreSecurity/services/group-version.service';
import { ModuleService } from '../../_coreSecurity/services/module.service';
import { AddGroupVersionComponent } from './add-group-version/add-group-version.component';

@Component({
  selector: 'app-group-version',
  templateUrl: './group-version.component.html',
  styleUrls: ['./group-version.component.css'],
  standalone: false,
})
export class GroupVersionComponent implements OnInit {
  bsModalRef!: BsModalRef;
  groupVersionTable: any;
  groupVersionTableObj: any;
  selectedGroupVersion!: any;
  selectedGroupVersionId!: number;
  @ViewChild('groupVersionGrid')
  groupVersionGrid!: { nativeElement: any };
  activeInactiveFlag: string | null = 'A';
  disableButton: string = 'Disable';

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private moduleService: ModuleService,
    private toastr: ToastrService,
    private groupVersionService: GroupVersionService,
  ) {}

  ngOnInit() {
    this.initGroupVersionGrid();
  }

  ngAfterViewInit(): void {
    this.initGroupVersionGrid();
  }

  addGroupVersion() {
    const initialState = {
      title: 'Add Group / Version',
    };
    this.bsModalRef = this.modalService.show(AddGroupVersionComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result == true) {
        this.groupVersionTableObj.draw();
      }
    });
  }
  editGroupVersion() {
    if (!this.selectedGroupVersion) {
      this.toastr.warning('Please select a record to Edit');
    } else {
      const initialState = {
        title: 'Edit Group / Version',
        groupVersion: this.selectedGroupVersion,
      };
      this.bsModalRef = this.modalService.show(AddGroupVersionComponent, {
        class: 'modal-md base-modal',
        initialState,
        backdrop: 'static',
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          this.groupVersionTableObj.draw();
        }
      });
    }
  }
  // deleteFeature(): void {
  //   if (!this.selectedFeature) {
  //     this.toastr.warning("Please select a record to Delete")
  //   }
  //   else {
  //     const initialState = { title: "Do you want to Delete?" };
  //     this.bsModalRef = this.modalService.show(ConfirmationDialog, { initialState, class: 'modal-sm base-modal' });
  //     this.bsModalRef.content.onClose.subscribe((result: any) => {
  //       if (result) {
  //         this.featureService.deleteFeature(this.selectedFeature.id).subscribe((res: { message: string | undefined; }) => {
  //           res.message ? this.toastr.success(res.message) : this.toastr.warning(res.message);
  //           this.featureTableObj.draw();
  //         })
  //       }
  //     })
  //   }
  // }
  disableOrEnableGroupVersion(): void {
    if (!this.selectedGroupVersion) {
      this.toastr.warning('Please select a group-version first.');
    } else {
      const initialState = {
        title: 'Do you want to ' + this.disableButton + ' this group-version?',
      };
      this.bsModalRef = this.modalService.show(ConfirmationDialog, {
        initialState,
        class: '',
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          console.log('flag:', this.activeInactiveFlag);
          this.selectedGroupVersion.activeStatus =
            this.activeInactiveFlag == 'I' ? 1 : 0;
          this.groupVersionService
            .updateGroupVersion(this.selectedGroupVersion)
            .subscribe((res: { message: string | undefined }) => {
              console.log('reees:', res);
              res.message
                ? this.toastr.success(res.message)
                : this.toastr.warning(res.message);
              this.groupVersionTableObj.draw();
            });
        }
      });
    }
  }

  initGroupVersionGrid() {
    let that = this;
    this.groupVersionTable = $(this.groupVersionGrid?.nativeElement);
    this.groupVersionTableObj = this.groupVersionTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: {
        url:
          environment.baseUrl +
          environment.authApiUrl +
          '/api/group-version/gridList',
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
          title: 'Group / Version No.',
          data: 'id',
          className: 'dt-left',
        },
        {
          title: 'Group / Version Name',
          data: 'name',
          name: 'name',
        },

        {
          title: 'Type',
          data: 'type',
          name: 'type',
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
          this.selectedGroupVersion = data.id;

          if (self.selectedGroupVersion) {
            self.selectedGroupVersion = null;
          }
          self.selectedGroupVersion = data;

          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
          }
          this.groupVersionService
            .getSingleGroupVersion(data.id)
            .subscribe((res: GroupVersion) => {
              this.selectedGroupVersion = res;
            });
          console.log('Selected group-version ', this.selectedGroupVersion);
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
    this.groupVersionTableObj.draw();
  }
}
