import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { AcademicShift } from '../../_coreSecurity/models/academic-shift.model';
import { AcademicShiftService } from '../../_coreSecurity/services/academic-shift.service';
import { ModuleService } from '../../_coreSecurity/services/module.service';
import { AddShiftComponent } from './add-shift/add-shift.component';

@Component({
  selector: 'app-academic-shift',
  templateUrl: './academic-shift.component.html',
  styleUrls: ['./academic-shift.component.css'],
  standalone: false,
})
export class AcademicShiftComponent implements OnInit {
  bsModalRef!: BsModalRef;
  academicShiftTable: any;
  academicShiftTableObj: any;
  selectedShift!: any;
  selectedShiftId!: number;
  @ViewChild('academicShiftGrid')
  academicShiftGrid!: { nativeElement: any };
  activeInactiveFlag: string | null = 'A';
  disableButton: string = 'Disable';

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private moduleService: ModuleService,
    private toastr: ToastrService,
    private academicShiftService: AcademicShiftService,
  ) {}

  ngOnInit() {
    this.initAcademicShiftGrid();
  }

  ngAfterViewInit(): void {
    this.initAcademicShiftGrid();
  }

  addShift() {
    const initialState = {
      title: 'Add Shift',
    };
    this.bsModalRef = this.modalService.show(AddShiftComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result == true) {
        this.academicShiftTableObj.draw();
      }
    });
  }
  editShift() {
    if (!this.selectedShift) {
      this.toastr.warning('Please select a record to Edit');
    } else {
      const initialState = {
        title: 'Edit Shift',
        academicShift: this.selectedShift,
      };
      this.bsModalRef = this.modalService.show(AddShiftComponent, {
        class: 'modal-md base-modal',
        initialState,
        backdrop: 'static',
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          this.academicShiftTableObj.draw();
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
  disableOrEnableShift(): void {
    if (!this.selectedShift) {
      this.toastr.warning('Please select a shift first.');
    } else {
      const initialState = {
        title: 'Do you want to ' + this.disableButton + ' this shift?',
      };
      this.bsModalRef = this.modalService.show(ConfirmationDialog, {
        initialState,
        class: '',
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          console.log('flag:', this.activeInactiveFlag);
          this.selectedShift.activeStatus =
            this.activeInactiveFlag == 'I' ? 1 : 0;
          this.academicShiftService
            .updateShift(this.selectedShift)
            .subscribe((res: { message: string | undefined }) => {
              console.log('reees:', res);
              res.message
                ? this.toastr.success(res.message)
                : this.toastr.warning(res.message);
              this.academicShiftTableObj.draw();
            });
        }
      });
    }
  }

  initAcademicShiftGrid() {
    let that = this;
    this.academicShiftTable = $(this.academicShiftGrid?.nativeElement);
    this.academicShiftTableObj = this.academicShiftTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: {
        url:
          environment.baseUrl + environment.authApiUrl + '/api/shift/gridList',
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
          title: 'Academic Shift No.',
          data: 'id',
          className: 'dt-left',
        },
        {
          title: 'Shift Name',
          data: 'shiftName',
          name: 'shiftName',
        },

        {
          title: 'Start Time',
          data: 'startTime',
          className: 'dt-left',
        },
        {
          title: 'End Time',
          data: 'endTime',
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
          this.selectedShift = data.id;

          if (self.selectedShift) {
            self.selectedShift = null;
          }
          self.selectedShift = data;

          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
          }
          this.academicShiftService
            .getSingleShift(data.id)
            .subscribe((res: AcademicShift) => {
              this.selectedShift = res;
            });
          console.log('Selected shift ', this.selectedShift);
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
    this.academicShiftTableObj.draw();
  }
}
