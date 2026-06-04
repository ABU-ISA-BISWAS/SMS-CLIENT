import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { FeeStructureService } from '../../_coreSecurity/services/fee-structure.service';
import { AddFeeStructureComponent } from './add-fee-structure/add-fee-structure.component';

@Component({
  selector: 'app-fee-structure',
  templateUrl: './fee-structure.component.html',
  styleUrls: ['./fee-structure.component.css'],
  standalone: false,
})
export class FeeStructureComponent implements OnInit, AfterViewInit {
  bsModalRef!: BsModalRef;

  feeStructureTable: any;
  feeStructureTableObj: any;

  selectedFeeStructure: any;

  @ViewChild('feeStructureGrid')
  feeStructureGrid!: { nativeElement: any };

  activeInactiveFlag: string | null = 'A';
  disableButton: string = 'Disable';

  // Filter dropdowns
  sessionList: any[] = [];
  classList: any[] = [];
  filterSessionNo: number | null = null;
  filterClassNo: number | null = null;

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private feeStructureService: FeeStructureService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.loadFilterDropdowns();
  }

  ngAfterViewInit(): void {
    this.initGrid();
  }

  loadFilterDropdowns() {
    this.feeStructureService.getAllSessions().subscribe({
      next: (res: any) => (this.sessionList = res.items || []),
    });
    this.feeStructureService.getAllClasses().subscribe({
      next: (res: any) => (this.classList = res.items || []),
    });
  }

  applyFilter() {
    this.feeStructureTableObj.draw();
  }

  clearFilter() {
    this.filterSessionNo = null;
    this.filterClassNo = null;
    this.feeStructureTableObj.draw();
  }

  addFeeStructure() {
    const initialState = { title: 'Add Fee Structure' };
    this.bsModalRef = this.modalService.show(AddFeeStructureComponent, {
      class: 'modal-lg base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) this.feeStructureTableObj.draw();
    });
  }

  editFeeStructure() {
    if (!this.selectedFeeStructure) {
      this.toastr.warning('Please select a record to Edit');
      return;
    }

    const feeStructure = {
      ...this.selectedFeeStructure,
      classMasterNo: this.selectedFeeStructure.classMaster?.id,
      studentCategoryNo: this.selectedFeeStructure.studentCategory?.id,
      academicSessionNo: this.selectedFeeStructure.academicSession?.id,
      feeHeadNo: this.selectedFeeStructure.feeHead?.id,
    };

    const initialState = {
      title: 'Edit Fee Structure',
      feeStructure,
    };
    this.bsModalRef = this.modalService.show(AddFeeStructureComponent, {
      class: 'modal-lg base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) this.feeStructureTableObj.draw();
    });
  }

  deleteFeeStructure(): void {
    if (!this.selectedFeeStructure) {
      this.toastr.warning('Please select a record to Delete');
      return;
    }
    const initialState = {
      title: 'Do you want to Delete this Fee Structure?',
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.feeStructureService
          .delete(this.selectedFeeStructure.id)
          .subscribe({
            next: (res: any) => {
              res.success
                ? this.toastr.success(res.message || 'Deleted successfully!')
                : this.toastr.warning(res.message);
              this.selectedFeeStructure = null;
              this.feeStructureTableObj.draw();
            },
            error: () => this.toastr.error('Something went wrong.'),
          });
      }
    });
  }

  disableOrEnable(): void {
    if (!this.selectedFeeStructure) {
      this.toastr.warning('Please select a record first.');
      return;
    }
    const initialState = {
      title: `Do you want to ${this.disableButton} this Fee Structure?`,
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.selectedFeeStructure.activeStatus =
          this.activeInactiveFlag === 'I' ? 1 : 0;
        const feeStructure = {
          ...this.selectedFeeStructure,
          classMasterNo: this.selectedFeeStructure.classMaster?.id,
          studentCategoryNo: this.selectedFeeStructure.studentCategory?.id,
          academicSessionNo: this.selectedFeeStructure.academicSession?.id,
          feeHeadNo: this.selectedFeeStructure.feeHead?.id,
        };

        this.feeStructureService.update(feeStructure).subscribe({
          next: (res: any) => {
            res.message
              ? this.toastr.success(res.message)
              : this.toastr.warning(res.message);
            this.feeStructureTableObj.draw();
          },
        });
      }
    });
  }

  initGrid() {
    const that = this;
    this.feeStructureTable = $(this.feeStructureGrid?.nativeElement);
    this.feeStructureTableObj = this.feeStructureTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url:
          environment.baseUrl +
          environment.authApiUrl +
          '/api/fee-structure/gridList',
        type: 'GET',
        data: function (d: any) {
          d.customSearch = d.search.value;
          d.activeInactiveFlag = that.activeInactiveFlag;
          d.academicSessionNo = that.filterSessionNo || '';
          d.classMasterNo = that.filterClassNo || '';
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
        {
          title: 'Fee Structure No.',
          data: 'id',
          className: 'dt-left',
          name: 'id',
        },
        { title: 'Session', data: 'sessionName', name: 'sessionName' },
        { title: 'Class', data: 'className', name: 'className' },
        { title: 'Category', data: 'categoryName', name: 'categoryName' },
        { title: 'Fee Head', data: 'feeHeadName', name: 'feeHeadName' },
        {
          title: 'Amount (৳)',
          data: 'amount',
          render: (data: number) =>
            `<span class="fw-semibold">৳ ${Number(data).toLocaleString(
              'en-US',
              {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              },
            )}</span>`,
        },
        { title: 'Due Day', data: 'dueDay', className: 'dt-left' },
        {
          title: 'Fine (৳)',
          data: 'fineAmount',
          render: (data: number) =>
            data > 0
              ? `<span class="text-danger">৳ ${Number(data).toLocaleString()}</span>`
              : '<span class="text-muted">—</span>',
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
            this.selectedFeeStructure = null;
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
            this.feeStructureService
              .getSingle(data.id)
              .subscribe((res: any) => {
                this.selectedFeeStructure = res;

                this.selectedFeeStructure.effectiveFrom = this.formatDate(
                  res.effectiveFrom,
                );
                this.selectedFeeStructure.effectiveTo = this.formatDate(
                  res.effectiveTo,
                );
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
    this.feeStructureTableObj.draw();
  }
}
