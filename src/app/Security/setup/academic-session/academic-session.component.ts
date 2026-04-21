import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { FeatureModel } from '../../_coreSecurity/models/feature.model';
import { AcademicSessionService } from '../../_coreSecurity/services/academic-session.service';
import { FeatureService } from '../../_coreSecurity/services/feature.service';
import { ModuleService } from '../../_coreSecurity/services/module.service';
import { AddSessionComponent } from './add-session/add-session.component';

@Component({
  selector: 'app-academic-session',
  templateUrl: './academic-session.component.html',
  styleUrls: ['./academic-session.component.css'],
  standalone: false,
})
export class AcademicSessionComponent implements OnInit {
  bsModalRef!: BsModalRef;
  academicSessionTable: any;
  academicSessionTableObj: any;
  selectedSession!: any;
  selectedSessionId!: number;
  @ViewChild('academicSessionGrid')
  academicSessionGrid!: { nativeElement: any };
  activeInactiveFlag: string | null = 'A';
  disableButton: string = 'Disable';

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private moduleService: ModuleService,
    private featureService: FeatureService,
    private toastr: ToastrService,
    private academicSessionService: AcademicSessionService,
  ) {}

  ngOnInit() {
    this.initAcademicSessionGrid();
  }

  ngAfterViewInit(): void {
    this.initAcademicSessionGrid();
  }

  addSession() {
    const initialState = {
      title: 'Add Session',
    };
    this.bsModalRef = this.modalService.show(AddSessionComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result == true) {
        this.academicSessionTableObj.draw();
      }
    });
  }
  editFeature() {
    if (!this.selectedSession) {
      this.toastr.warning('Please select a record to Edit');
    } else {
      const initialState = {
        title: 'Edit Session',
        feature: this.selectedSession,
      };
      this.bsModalRef = this.modalService.show(AddSessionComponent, {
        class: 'modal-md base-modal',
        initialState,
        backdrop: 'static',
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          this.academicSessionTableObj.draw();
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
  disableOrEnableFeature(): void {
    console.log('Selected feature from disabe enable:', this.selectedSession);
    if (!this.selectedSession) {
      this.toastr.warning('Please select a feature first.');
    } else {
      const initialState = {
        title: 'Do you want to ' + this.disableButton + ' this Feature?',
      };
      this.bsModalRef = this.modalService.show(ConfirmationDialog, {
        initialState,
        class: '',
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          console.log('flag:', this.activeInactiveFlag);
          this.selectedSession.activeStatus =
            this.activeInactiveFlag == 'I' ? 1 : 0;
          this.featureService
            .updateFeature(this.selectedSession)
            .subscribe((res: { message: string | undefined }) => {
              console.log('reees:', res);
              res.message
                ? this.toastr.success(res.message)
                : this.toastr.warning(res.message);
              this.academicSessionTableObj.draw();
            });
        }
      });
    }
  }

  initAcademicSessionGrid() {
    let that = this;
    this.academicSessionTable = $(this.academicSessionGrid?.nativeElement);
    this.academicSessionTableObj = this.academicSessionTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: {
        url:
          environment.baseUrl +
          environment.authApiUrl +
          '/api/session/gridList',
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
          title: 'Academic Session No.',
          data: 'id',
          className: 'dt-left',
        },
        {
          title: 'Session Name',
          data: 'submenuName',
          name: 'submenuName',
        },
        {
          title: 'Start Date',
          data: 'submenuId',
        },
        {
          title: 'End Date',
          data: 'slNo',
          className: 'dt-left',
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
          this.selectedSession = data.id;

          if (self.selectedSession) {
            self.selectedSession = null;
          }
          self.selectedSession = data;

          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
          }
          this.featureService
            .getSingleFeature(data.id)
            .subscribe((res: FeatureModel) => {
              this.selectedSession = res;
            });
          console.log('Selected Feature ', this.selectedSession);
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
    this.academicSessionTableObj.draw();
  }
}
