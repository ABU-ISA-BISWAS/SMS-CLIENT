import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { PeriodService } from '../../_coreSecurity/services/period.service';
import { AddPeriodComponent } from './add-period/add-period.component';
@Component({
  selector: 'app-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.css'],
  standalone: false,
})
export class PeriodComponent implements OnInit, AfterViewInit {
  bsModalRef!: BsModalRef;
  periodTable: any;
  periodTableObj: any;
  selectedPeriod: any;

  @ViewChild('periodGrid') periodGrid!: { nativeElement: any };

  activeInactiveFlag: string | null = 'A';
  disableButton: string = 'Disable';

  shiftList: any[] = [];
  filterShiftNo: number | null = null;

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private periodService: PeriodService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.loadShifts();
  }
  ngAfterViewInit(): void {
    this.initGrid();
  }

  loadShifts() {
    this.periodService.getAllShifts().subscribe({
      next: (res: any) => (this.shiftList = res.items || []),
    });
  }

  applyFilter() {
    this.periodTableObj.draw();
  }
  clearFilter() {
    this.filterShiftNo = null;
    this.periodTableObj.draw();
  }

  addPeriod() {
    const initialState = { title: 'Add Period' };
    this.bsModalRef = this.modalService.show(AddPeriodComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((r: boolean) => {
      if (r) this.periodTableObj.draw();
    });
  }

  editPeriod() {
    if (!this.selectedPeriod) {
      this.toastr.warning('Please select a record to Edit');
      return;
    }

    const period = {
      ...this.selectedPeriod,
      shiftNo: this.selectedPeriod.shift?.id,
    };

    const initialState = {
      title: 'Edit Period',
      period,
    };

    this.bsModalRef = this.modalService.show(AddPeriodComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((r: boolean) => {
      if (r) this.periodTableObj.draw();
    });
  }

  deletePeriod(): void {
    if (!this.selectedPeriod) {
      this.toastr.warning('Please select a record to Delete');
      return;
    }
    const initialState = { title: 'Do you want to Delete this Period?' };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((r: boolean) => {
      if (r) {
        this.periodService.delete(this.selectedPeriod.id).subscribe({
          next: (res: any) => {
            res.success
              ? this.toastr.success(res.message || 'Deleted successfully!')
              : this.toastr.warning(res.message);
            this.selectedPeriod = null;
            this.periodTableObj.draw();
          },
          error: () => this.toastr.error('Something went wrong.'),
        });
      }
    });
  }

  disableOrEnable(): void {
    if (!this.selectedPeriod) {
      this.toastr.warning('Please select a record first.');
      return;
    }
    const initialState = {
      title: `Do you want to ${this.disableButton} this Period?`,
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((r: boolean) => {
      if (r) {
        this.selectedPeriod.activeStatus =
          this.activeInactiveFlag === 'I' ? 1 : 0;
        this.periodService.update(this.selectedPeriod).subscribe({
          next: (res: any) => {
            res.message
              ? this.toastr.success(res.message)
              : this.toastr.warning(res.message);
            this.periodTableObj.draw();
          },
        });
      }
    });
  }

  initGrid() {
    const that = this;
    this.periodTable = $(this.periodGrid?.nativeElement);
    this.periodTableObj = this.periodTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url:
          environment.baseUrl +
          environment.authApiUrl +
          '/api/period-master/gridList',
        type: 'GET',
        data: function (d: any) {
          d.customSearch = d.search.value;
          d.activeInactiveFlag = that.activeInactiveFlag;
          d.shiftNo = that.filterShiftNo || '';
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
        { title: 'Shift', data: 'shiftName' },
        { title: 'Period Name', data: 'periodName' },
        {
          title: 'Duration(Minutes)',
          data: 'duratonMinutes',
          className: 'dt-left',
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
          title: 'Period Type',
          data: 'periodType',
          render: (data: string) => {
            const colorMap: any = {
              CLASS: 'bg-primary-subtle text-primary',
              BREAK: 'bg-warning-subtle text-warning',
              PRAYER: 'bg-success-subtle text-success',
              HASSEMBLYALL: 'bg-info-subtle text-info',
            };
            const cls = colorMap[data] || 'bg-secondary-subtle text-secondary';
            return `<span class="badge rounded-pill ${cls} px-3 py-2">${data}</span>`;
          },
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
            this.selectedPeriod = null;
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
            this.periodService.getSingle(data.id).subscribe((res: any) => {
              this.selectedPeriod = res;
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
    this.periodTableObj.draw();
  }
}
