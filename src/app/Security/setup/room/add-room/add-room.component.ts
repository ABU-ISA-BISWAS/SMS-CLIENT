import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Room } from '../../../_coreSecurity/models/room.model';
import { RoomService } from '../../../_coreSecurity/services/room.service';
@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css'],
  standalone: false,
})
export class AddRoomComponent implements OnInit {
  room: Room = new Room();
  onClose!: Subject<boolean>;
  title = '';
  isSaving: boolean = false;
  buildingList: any[] = [];

  roomTypes = [
    { value: 'CLASSROOM', label: 'Class Room' },
    { value: 'LAB', label: 'Laboratory' },
    { value: 'LIBRARY', label: 'Library' },
    { value: 'OFFICE', label: 'Office' },
    { value: 'HALL', label: 'Hall / Auditorium' },
    { value: 'COMMON', label: 'Common Room' },
  ];

  constructor(
    public bsModalRef: BsModalRef,
    private roomService: RoomService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
    this.loadBuildings();
    if (!this.room.id) {
      this.room.activeStatus = 1;
      this.room.roomType = 'CLASSROOM';
    }
  }

  loadBuildings() {
    this.roomService.getAllBuildings().subscribe({
      next: (res: any) => (this.buildingList = res.items || []),
      error: () => this.toastr.error('Failed to load buildings.'),
    });
  }

  saveRoom() {
    this.isSaving = true;
    this.toggleValue(this.room);

    if (!this.checkValidation()) {
      this.isSaving = false;
      return;
    }

    const req$ = this.room.id
      ? this.roomService.update(this.room)
      : this.roomService.save(this.room);

    req$.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success(res.message || 'Room saved successfully!');
          this.onClose.next(true);
          this.bsModalRef.hide();
        } else {
          this.toastr.warning(res.message || 'Operation failed.');
          this.onClose.next(false);
        }
      },
      error: () => {
        this.toastr.error('Something went wrong. Please try again.');
        this.onClose.next(false);
      },
    });
  }

  checkValidation(): boolean {
    if (!this.room.buildingNo) {
      this.toastr.warning("Building can't be empty!");
      return false;
    }
    if (!this.room.roomCode) {
      this.toastr.warning("Room Code can't be empty!");
      return false;
    }
    if (!this.room.roomType) {
      this.toastr.warning("Room Type can't be empty!");
      return false;
    }
    return true;
  }

  toggleValue(obj: any) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === true) obj[key] = 1;
      if (obj[key] === false) obj[key] = 0;
    });
  }
}
