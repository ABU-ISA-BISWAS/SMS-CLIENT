import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { SalaryGradeService } from '../../_coreSecurity/services/salary-grade.service';
import { AddSalaryGradeComponent } from './add-salary-grade/add-salary-grade.component';

@Component({
  selector: 'app-salary-grade',
  templateUrl: './salary-grade.component.html',
  styleUrls: ['./salary-grade.component.css'],
  standalone: false,
})
export class SalaryGradeComponent implements OnInit, AfterViewInit {
  bsModalRef!: BsModalRef;
  salaryTable: any;
  salaryTableObj: any;
  selectedGrade: any;
  selectedGradeGross: any = null;

  @ViewChild('salaryGrid') salaryGrid!: { nativeElement: any };

  activeInactiveFlag: string | null = 'A';
  disableButton: string = 'Disable';

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private salaryGradeService: SalaryGradeService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {}
  ngAfterViewInit(): void {
    this.initGrid();
  }

  addGrade() {
    const initialState = { title: 'Add Salary Grade' };
    this.bsModalRef = this.modalService.show(AddSalaryGradeComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((r: boolean) => {
      if (r) this.salaryTableObj.draw();
    });
  }

  editGrade() {
    if (!this.selectedGrade) {
      this.toastr.warning('Please select a record to Edit');
      return;
    }
    const initialState = {
      title: 'Edit Salary Grade',
      grade: this.selectedGrade,
    };
    this.bsModalRef = this.modalService.show(AddSalaryGradeComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((r: boolean) => {
      if (r) this.salaryTableObj.draw();
    });
  }

  deleteGrade(): void {
    if (!this.selectedGrade) {
      this.toastr.warning('Please select a record to Delete');
      return;
    }
    const initialState = { title: 'Do you want to Delete this Salary Grade?' };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-md base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((r: boolean) => {
      if (r) {
        this.salaryGradeService.delete(this.selectedGrade.id).subscribe({
          next: (res: any) => {
            res.success
              ? this.toastr.success(res.message || 'Deleted successfully!')
              : this.toastr.warning(res.message);
            this.selectedGrade = null;
            this.salaryTableObj.draw();
          },
          error: () => this.toastr.error('Something went wrong.'),
        });
      }
    });
  }

  disableOrEnable(): void {
    if (!this.selectedGrade) {
      this.toastr.warning('Please select a record first.');
      return;
    }
    const initialState = {
      title: `Do you want to ${this.disableButton} this Salary Grade?`,
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-md base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((r: boolean) => {
      if (r) {
        this.selectedGrade.activeStatus =
          this.activeInactiveFlag === 'I' ? 1 : 0;
        this.salaryGradeService.update(this.selectedGrade).subscribe({
          next: (res: any) => {
            res.message
              ? this.toastr.success(res.message)
              : this.toastr.warning(res.message);
            this.salaryTableObj.draw();
          },
        });
      }
    });
  }

  initGrid() {
    const that = this;
    this.salaryTable = $(this.salaryGrid?.nativeElement);
    this.salaryTableObj = this.salaryTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url:
          environment.baseUrl +
          environment.authApiUrl +
          '/api/salary-grade/gridList',
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
        { title: 'Sl.', data: 'id' },
        { title: 'Grade Code', data: 'gradeCode' },
        { title: 'Grade Name', data: 'gradeName' },
        {
          title: 'Basic (৳)',
          data: 'basicSalary',
          render: (data: number) =>
            `<span class="fw-semibold">৳ ${Number(data).toLocaleString()}</span>`,
        },
        {
          title: 'House Rent %',
          data: 'houseRentPct',
          render: (data: number) => `${data}%`,
        },
        {
          title: 'Medical (৳)',
          data: 'medicalAllowance',
          render: (data: number) => `৳ ${Number(data).toLocaleString()}`,
        },
        {
          title: 'Transport (৳)',
          data: 'transportAllowance',
          render: (data: number) => `৳ ${Number(data).toLocaleString()}`,
        },
        {
          title: 'Gross (৳)',
          data: null,
          render: (data: any, type: any, row: any) =>
            `<button class="btn btn-sm btn-outline-success gross-btn" data-id="${row.id}">
             <i class="ri-money-dollar-circle-line"></i> View Gross </button>`,
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
        // Gross button click
        $(row)
          .find('.gross-btn')
          .off('click')
          .on('click', (e) => {
            e.stopPropagation(); // row select trigger হবে না
            this.salaryGradeService.getSingle(data.id).subscribe((res: any) => {
              this.selectedGradeGross = res;
              const modalEl = document.getElementById('grossModal');
              const modal = new (window as any).bootstrap.Modal(modalEl);
              modal.show();
            });
          });
        $('td', row).off('click');
        $('td', row).on('click', () => {
          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');
            this.selectedGrade = null;
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
            this.salaryGradeService.getSingle(data.id).subscribe((res: any) => {
              this.selectedGrade = res;

              this.selectedGrade.effectiveFrom = this.formatDate(
                res.effectiveFrom,
              );
              this.selectedGrade.effectiveTo = this.formatDate(res.effectiveTo);
            });
          }
        });
        return row;
      },
    });
  }

  getGrossBreakdown(grade: any) {
    const basic = grade.basicSalary || 0;
    const houseRent = (basic * (grade.houseRentPct || 0)) / 100;
    const medical = grade.medicalAllowance || 0;
    const transport = grade.transportAllowance || 0;
    const conveyance = grade.conveyance || 0;
    const other = grade.otherAllowance || 0;
    const gross = basic + houseRent + medical + transport + conveyance + other;
    return { basic, houseRent, medical, transport, conveyance, other, gross };
  }

  statusCheck(status: string) {
    this.activeInactiveFlag = status;
    this.disableButton = status === 'A' ? 'Disable' : 'Enable';
    this.salaryTableObj.draw();
  }

  // Helper method:
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0]; // "2024-01-15"
  }
}
