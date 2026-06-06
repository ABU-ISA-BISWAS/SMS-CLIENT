import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { RoomService } from '../../_coreSecurity/services/room.service';
import { AddRoomComponent } from './add-room/add-room.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
  standalone: false,
})
export class RoomComponent implements OnInit, AfterViewInit {
  bsModalRef!: BsModalRef;
  roomTable: any;
  roomTableObj: any;
  selectedRoom: any;

  @ViewChild('roomGrid') roomGrid!: { nativeElement: any };

  activeInactiveFlag: string | null = 'A';
  disableButton: string = 'Disable';

  buildingList: any[] = [];
  filterBuildingNo: number | null = null;

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private roomService: RoomService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.loadBuildings();
  }
  ngAfterViewInit(): void {
    this.initGrid();
  }

  loadBuildings() {
    this.roomService.getAllBuildings().subscribe({
      next: (res: any) => (this.buildingList = res.items || []),
    });
  }

  applyFilter() {
    this.roomTableObj.draw();
  }
  clearFilter() {
    this.filterBuildingNo = null;
    this.roomTableObj.draw();
  }

  addRoom() {
    const initialState = { title: 'Add Room' };
    this.bsModalRef = this.modalService.show(AddRoomComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((r: boolean) => {
      if (r) this.roomTableObj.draw();
    });
  }

  editRoom() {
    if (!this.selectedRoom) {
      this.toastr.warning('Please select a record to Edit');
      return;
    }

    const room = {
      ...this.selectedRoom,
      buildingNo: this.selectedRoom.building?.id,
    };

    const initialState = {
      title: 'Edit Room',
      room,
    };

    this.bsModalRef = this.modalService.show(AddRoomComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((r: boolean) => {
      if (r) this.roomTableObj.draw();
    });
  }

  deleteRoom(): void {
    if (!this.selectedRoom) {
      this.toastr.warning('Please select a record to Delete');
      return;
    }
    const initialState = { title: 'Do you want to Delete this Room?' };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((r: boolean) => {
      if (r) {
        this.roomService.delete(this.selectedRoom.id).subscribe({
          next: (res: any) => {
            res.success
              ? this.toastr.success(res.message || 'Deleted successfully!')
              : this.toastr.warning(res.message);
            this.selectedRoom = null;
            this.roomTableObj.draw();
          },
          error: () => this.toastr.error('Something went wrong.'),
        });
      }
    });
  }

  disableOrEnable(): void {
    if (!this.selectedRoom) {
      this.toastr.warning('Please select a record first.');
      return;
    }
    const initialState = {
      title: `Do you want to ${this.disableButton} this Room?`,
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((r: boolean) => {
      if (r) {
        this.selectedRoom.activeStatus =
          this.activeInactiveFlag === 'I' ? 1 : 0;
        this.roomService.update(this.selectedRoom).subscribe({
          next: (res: any) => {
            res.message
              ? this.toastr.success(res.message)
              : this.toastr.warning(res.message);
            this.roomTableObj.draw();
          },
        });
      }
    });
  }

  initGrid() {
    const that = this;
    this.roomTable = $(this.roomGrid?.nativeElement);
    this.roomTableObj = this.roomTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url:
          environment.baseUrl + environment.authApiUrl + '/api/room/gridList',
        type: 'GET',
        data: function (d: any) {
          d.customSearch = d.search.value;
          d.activeInactiveFlag = that.activeInactiveFlag;
          d.buildingNo = that.filterBuildingNo || '';
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
        { title: 'Building', data: 'buildingName' },
        { title: 'Room Code', data: 'roomCode' },
        { title: 'Room Name', data: 'roomName' },
        { title: 'Floor', data: 'floorNo' },
        {
          title: 'Type',
          data: 'roomType',
          render: (data: string) => {
            const colorMap: any = {
              CLASSROOM: 'bg-primary-subtle text-primary',
              LAB: 'bg-warning-subtle text-warning',
              LIBRARY: 'bg-success-subtle text-success',
              HALL: 'bg-info-subtle text-info',
              OFFICE: 'bg-secondary-subtle text-secondary',
              COMMON: 'bg-secondary-subtle text-secondary',
            };
            const cls = colorMap[data] || 'bg-secondary-subtle text-secondary';
            return `<span class="badge rounded-pill ${cls} px-3 py-2">${data}</span>`;
          },
        },
        { title: 'Capacity', data: 'capacity' },
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
            this.selectedRoom = null;
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
            this.roomService.getSingle(data.id).subscribe((res: any) => {
              this.selectedRoom = res;
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
    this.roomTableObj.draw();
  }
}
