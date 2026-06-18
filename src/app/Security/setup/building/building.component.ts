import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { BuildingService } from '../../_coreSecurity/services/building.service';
import { AddBuildingComponent } from './add-building/add-building.component';

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css'],
  standalone: false,
})
export class BuildingComponent implements OnInit, AfterViewInit {
  bsModalRef!: BsModalRef;
  buildingTable: any;
  buildingTableObj: any;
  selectedBuilding: any;

  @ViewChild('buildingGrid') buildingGrid!: { nativeElement: any };

  activeInactiveFlag: string | null = 'A';
  disableButton: string = 'Disable';

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private buildingService: BuildingService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {}
  ngAfterViewInit(): void {
    this.initGrid();
  }

  addBuilding() {
    const initialState = { title: 'Add Building' };
    this.bsModalRef = this.modalService.show(AddBuildingComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((r: boolean) => {
      if (r) this.buildingTableObj.draw();
    });
  }

  editBuilding() {
    if (!this.selectedBuilding) {
      this.toastr.warning('Please select a record to Edit');
      return;
    }
    const initialState = {
      title: 'Edit Building',
      building: this.selectedBuilding,
    };
    this.bsModalRef = this.modalService.show(AddBuildingComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((r: boolean) => {
      if (r) this.buildingTableObj.draw();
    });
  }

  deleteBuilding(): void {
    if (!this.selectedBuilding) {
      this.toastr.warning('Please select a record to Delete');
      return;
    }
    const initialState = { title: 'Do you want to Delete this Building?' };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: '',
    });
    this.bsModalRef.content.onClose.subscribe((r: boolean) => {
      if (r) {
        this.buildingService.delete(this.selectedBuilding.id).subscribe({
          next: (res: any) => {
            res.success
              ? this.toastr.success(res.message || 'Deleted successfully!')
              : this.toastr.warning(res.message);
            this.selectedBuilding = null;
            this.buildingTableObj.draw();
          },
          error: () => this.toastr.error('Something went wrong.'),
        });
      }
    });
  }

  disableOrEnable(): void {
    if (!this.selectedBuilding) {
      this.toastr.warning('Please select a record first.');
      return;
    }
    const initialState = {
      title: `Do you want to ${this.disableButton} this Building?`,
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((r: boolean) => {
      if (r) {
        this.selectedBuilding.activeStatus =
          this.activeInactiveFlag === 'I' ? 1 : 0;
        this.buildingService.update(this.selectedBuilding).subscribe({
          next: (res: any) => {
            res.message
              ? this.toastr.success(res.message)
              : this.toastr.warning(res.message);
            this.buildingTableObj.draw();
          },
        });
      }
    });
  }

  initGrid() {
    const that = this;
    this.buildingTable = $(this.buildingGrid?.nativeElement);
    this.buildingTableObj = this.buildingTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url:
          environment.baseUrl +
          environment.authApiUrl +
          '/api/building/gridList',
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
        { title: 'Sl.', data: 'id', className: 'dt-left' },
        { title: 'Building Code', data: 'buildingCode' },
        { title: 'Building Name', data: 'buildingName' },
        { title: 'Total Floor', data: 'totalFloor', className: 'dt-left' },
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
            this.selectedBuilding = null;
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
            this.buildingService.getSingle(data.id).subscribe((res: any) => {
              this.selectedBuilding = res;
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
    this.buildingTableObj.draw();
  }
}
