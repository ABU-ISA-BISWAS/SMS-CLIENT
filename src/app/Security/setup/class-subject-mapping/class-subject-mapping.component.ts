import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { ClassSubjectMappingService } from '../../_coreSecurity/services/class-subject-mapping.service';
import { AddClassSubjectMappingComponent } from './add-class-subject-mapping/add-class-subject-mapping.component';

@Component({
  selector: 'app-class-subject-mapping',
  templateUrl: './class-subject-mapping.component.html',
  styleUrls: ['./class-subject-mapping.component.css'],
  standalone: false,
})
export class ClassSubjectMappingComponent implements OnInit, AfterViewInit {
  bsModalRef!: BsModalRef;

  mappingTable: any;
  mappingTableObj: any;

  selectedMapping: any;

  @ViewChild('mappingGrid')
  mappingGrid!: { nativeElement: any };

  activeInactiveFlag: string | null = 'A';
  disableButton: string = 'Disable';

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private mappingService: ClassSubjectMappingService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.initGrid();
  }

  addMapping() {
    const initialState = { title: 'Add Class Subject Mapping' };
    this.bsModalRef = this.modalService.show(AddClassSubjectMappingComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) this.mappingTableObj.draw();
    });
  }

  editMapping() {
    console.log('selected mapping:::::::', this.selectedMapping);
    if (!this.selectedMapping) {
      this.toastr.warning('Please select a record to Edit');
      return;
    }

    const mapping = {
      ...this.selectedMapping,
      classMasterNo: this.selectedMapping.classMaster?.id,
      groupVersionNo: this.selectedMapping.groupVersionMaster?.id,
      subjectMasterNo: this.selectedMapping.subjectMaster?.id,
    };

    const initialState = {
      title: 'Edit Class Subject Mapping',
      mapping,
    };

    this.bsModalRef = this.modalService.show(AddClassSubjectMappingComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) this.mappingTableObj.draw();
    });
  }

  deleteMapping(): void {
    if (!this.selectedMapping) {
      this.toastr.warning('Please select a record to Delete');
      return;
    }
    const initialState = {
      title: 'Do you want to Delete this mapping?',
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.mappingService.delete(this.selectedMapping.id).subscribe({
          next: (res: any) => {
            res.success
              ? this.toastr.success(res.message || 'Deleted successfully!')
              : this.toastr.warning(res.message);
            this.selectedMapping = null;
            this.mappingTableObj.draw();
          },
          error: () => this.toastr.error('Something went wrong.'),
        });
      }
    });
  }

  disableOrEnable(): void {
    if (!this.selectedMapping) {
      this.toastr.warning('Please select a record first.');
      return;
    }
    const initialState = {
      title: `Do you want to ${this.disableButton} this mapping?`,
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.selectedMapping.activeStatus =
          this.activeInactiveFlag === 'I' ? 1 : 0;
        this.mappingService.update(this.selectedMapping).subscribe({
          next: (res: any) => {
            res.message
              ? this.toastr.success(res.message)
              : this.toastr.warning(res.message);
            this.mappingTableObj.draw();
          },
        });
      }
    });
  }

  initGrid() {
    const that = this;
    this.mappingTable = $(this.mappingGrid?.nativeElement);
    this.mappingTableObj = this.mappingTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url:
          environment.baseUrl +
          environment.authApiUrl +
          '/api/class-subject-mapping/gridList',
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
        { title: 'ID', data: 'id', className: 'dt-left' },
        { title: 'Class Name', data: 'className' },
        { title: 'Group / Version', data: 'groupVersionName' },
        { title: 'Subject Code', data: 'subjectCode', className: 'dt-left' },
        { title: 'Subject Name', data: 'subjectName' },
        {
          title: 'Optional',
          data: 'isOptional',
          render: (data: number) =>
            data === 1
              ? '<span class="badge rounded-pill bg-info-subtle px-3 py-2 text-info">Optional</span>'
              : '<span class="badge rounded-pill bg-secondary-subtle px-3 py-2 text-secondary">Compulsory</span>',
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
            this.selectedMapping = null;
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
            this.mappingService.getSingle(data.id).subscribe((res: any) => {
              this.selectedMapping = res;
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
    this.mappingTableObj.draw();
  }
}
