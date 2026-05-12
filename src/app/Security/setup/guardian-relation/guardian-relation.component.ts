import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { GuardianRelation } from '../../_coreSecurity/models/guardian-relation.model';
import { GuardianRelationService } from '../../_coreSecurity/services/guardian-relation.service';
import { ModuleService } from '../../_coreSecurity/services/module.service';
import { AddGuardianRelationComponent } from './add-guardian-relation/add-guardian-relation.component'; 

@Component({
  selector: 'app-guardian-relation',
  templateUrl: './guardian-relation.component.html',
  styleUrls: ['./guardian-relation.component.css'],
  standalone: false,
})
export class GuardianRelationComponent implements OnInit {
  bsModalRef!: BsModalRef;
  guardianRelationTable: any;
  guardianRelationTableObj: any;
  selectedGuardianRelation!: any;
  selectedGuardianRelationId!: number;
  @ViewChild('guardianRelationGrid')
  guardianRelationGrid!: { nativeElement: any };
  activeInactiveFlag: string | null = 'A';
  disableButton: string = 'Disable';

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private moduleService: ModuleService,
    private toastr: ToastrService,
    private guardianRelationService: GuardianRelationService,
  ) {}

  ngOnInit() {
    this.initGuardianRelationGrid();
  }

  ngAfterViewInit(): void {
    this.initGuardianRelationGrid();
  }

  addGuardianRelation() {
    const initialState = {
      title: 'Add GuardianRelation',
    };
    this.bsModalRef = this.modalService.show(AddGuardianRelationComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result == true) {
        this.guardianRelationTableObj.draw();
      }
    });
  }
  editGuardianRelation() {
    if (!this.selectedGuardianRelation) {
      this.toastr.warning('Please select a record to Edit');
    } else {
      const initialState = {
        title: 'Edit GuardianRelation',
        guardianRelation: this.selectedGuardianRelation,
      };
      this.bsModalRef = this.modalService.show(AddGuardianRelationComponent, {
        class: 'modal-md base-modal',
        initialState,
        backdrop: 'static',
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          this.guardianRelationTableObj.draw();
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
  disableOrEnableGuardianRelation(): void {
    if (!this.selectedGuardianRelation) {
      this.toastr.warning('Please select a GuardianRelation first.');
    } else {
      const initialState = {
        title: 'Do you want to ' + this.disableButton + ' this GuardianRelation?',
      };
      this.bsModalRef = this.modalService.show(ConfirmationDialog, {
        initialState,
        class: '',
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          console.log('flag:', this.activeInactiveFlag);
          this.selectedGuardianRelation.activeStatus =
            this.activeInactiveFlag == 'I' ? 1 : 0;
          this.guardianRelationService
            .updateGuardianRelation(this.selectedGuardianRelation)
            .subscribe((res: { message: string | undefined }) => {
              console.log('reees:', res);
              res.message
                ? this.toastr.success(res.message)
                : this.toastr.warning(res.message);
              this.guardianRelationTableObj.draw();
            });
        }
      });
    }
  }

  initGuardianRelationGrid() {
    let that = this;
    this.guardianRelationTable = $(this.guardianRelationGrid?.nativeElement);
    this.guardianRelationTableObj = this.guardianRelationTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: {
        url:
          environment.baseUrl +
          environment.authApiUrl +
          '/api/guardian-relation/gridList',
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
          title: 'Guardian Relation No.',
          data: 'id',
          className: 'dt-left',
        },
        {
          title: 'Guardian Relation Name',
          data: 'name',
          name: 'name',
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
          this.selectedGuardianRelation = data.id;

          if (self.selectedGuardianRelation) {
            self.selectedGuardianRelation = null;
          }
          self.selectedGuardianRelation = data;

          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
          }
          this.guardianRelationService
            .getSingleGuardianRelation(data.id)
            .subscribe((res: GuardianRelation) => {
              this.selectedGuardianRelation = res;
            });
          console.log('Selected GuardianRelation ', this.selectedGuardianRelation);
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
    this.guardianRelationTableObj.draw();
  }
}
