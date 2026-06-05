import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { HolidayService } from '../../_coreSecurity/services/holiday.service';
import { AddHolidayComponent } from './add-holiday/add-holiday.component';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.css'],
  standalone: false,
})
export class HolidayComponent implements OnInit, AfterViewInit {
  bsModalRef!: BsModalRef;
  holidayTable: any;
  holidayTableObj: any;
  selectedHoliday: any;

  @ViewChild('holidayGrid') holidayGrid!: { nativeElement: any };

  activeInactiveFlag: string | null = 'A';
  disableButton: string = 'Disable';

  sessionList: any[] = [];
  filterSessionNo: number | null = null;

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private holidayService: HolidayService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.loadSessions();
  }

  ngAfterViewInit(): void {
    this.initGrid();
  }

  loadSessions() {
    this.holidayService.getAllSessions().subscribe({
      next: (res: any) => (this.sessionList = res.items || []),
    });
  }

  applyFilter() {
    this.holidayTableObj.draw();
  }

  clearFilter() {
    this.filterSessionNo = null;
    this.holidayTableObj.draw();
  }

  addHoliday() {
    const initialState = { title: 'Add Holiday' };
    this.bsModalRef = this.modalService.show(AddHolidayComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) this.holidayTableObj.draw();
    });
  }

  editHoliday() {
    if (!this.selectedHoliday) {
      this.toastr.warning('Please select a record to Edit');
      return;
    }

    const holiday = {
      ...this.selectedHoliday,
      academicSessionNo: this.selectedHoliday.academicSession?.id,
    };

    const initialState = {
      title: 'Edit Holiday',
      holiday,
    };
    this.bsModalRef = this.modalService.show(AddHolidayComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) this.holidayTableObj.draw();
    });
  }

  deleteHoliday(): void {
    if (!this.selectedHoliday) {
      this.toastr.warning('Please select a record to Delete');
      return;
    }
    const initialState = { title: 'Do you want to Delete this Holiday?' };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.holidayService.delete(this.selectedHoliday.id).subscribe({
          next: (res: any) => {
            res.success
              ? this.toastr.success(res.message || 'Deleted successfully!')
              : this.toastr.warning(res.message);
            this.selectedHoliday = null;
            this.holidayTableObj.draw();
          },
          error: () => this.toastr.error('Something went wrong.'),
        });
      }
    });
  }

  disableOrEnable(): void {
    if (!this.selectedHoliday) {
      this.toastr.warning('Please select a record first.');
      return;
    }
    const initialState = {
      title: `Do you want to ${this.disableButton} this Holiday?`,
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.selectedHoliday.activeStatus =
          this.activeInactiveFlag === 'I' ? 1 : 0;
        this.holidayService.update(this.selectedHoliday).subscribe({
          next: (res: any) => {
            res.message
              ? this.toastr.success(res.message)
              : this.toastr.warning(res.message);
            this.holidayTableObj.draw();
          },
        });
      }
    });
  }

  initGrid() {
    const that = this;
    this.holidayTable = $(this.holidayGrid?.nativeElement);
    this.holidayTableObj = this.holidayTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url:
          environment.baseUrl +
          environment.authApiUrl +
          '/api/holiday/gridList',
        type: 'GET',
        data: function (d: any) {
          d.customSearch = d.search.value;
          d.activeInactiveFlag = that.activeInactiveFlag;
          d.academicSessionNo = that.filterSessionNo || '';
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
        { title: 'Sl.', data: 'id' },
        { title: 'Holiday Name', data: 'holidayName' },
        { title: 'Session', data: 'sessionName' },
        {
          title: 'From Date',
          data: 'fromDate',
          render: (data: string | number | Date) => {
            return moment(new Date(data)).format('DD-MM-YYYY').toString();
          },
        },

        {
          title: 'To Date',
          data: 'toDate',
          render: (data: string | number | Date) => {
            return moment(new Date(data)).format('DD-MM-YYYY').toString();
          },
        },
        {
          title: 'Type',
          data: 'holidayType',
          render: (data: string) => {
            const colorMap: any = {
              NATIONAL: 'bg-primary-subtle text-primary',
              RELIGIOUS: 'bg-warning-subtle text-warning',
              SCHOOL: 'bg-info-subtle text-info',
              OPTIONAL: 'bg-secondary-subtle text-secondary',
            };
            const cls = colorMap[data] || 'bg-secondary-subtle text-secondary';
            return `<span class="badge rounded-pill ${cls} px-3 py-2">${data}</span>`;
          },
        },
        {
          title: 'Recurring',
          data: 'isRecurring',
          render: (data: number) =>
            data === 1
              ? '<span class="badge rounded-pill bg-info-subtle px-3 py-2 text-info">Yes</span>'
              : '<span class="badge rounded-pill bg-secondary-subtle px-3 py-2 text-secondary">No</span>',
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
            this.selectedHoliday = null;
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
            this.holidayService.getSingle(data.id).subscribe((res: any) => {
              this.selectedHoliday = res;

              this.selectedHoliday.fromDate = this.formatDate(res.fromDate);
              this.selectedHoliday.toDate = this.formatDate(res.toDate);
            });
          }
        });
        return row;
      },
    });
  }

  // Helper method:
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0]; // "2024-01-15"
  }

  statusCheck(status: string) {
    this.activeInactiveFlag = status;
    this.disableButton = status === 'A' ? 'Disable' : 'Enable';
    this.holidayTableObj.draw();
  }
}
