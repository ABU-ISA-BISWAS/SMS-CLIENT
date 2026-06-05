import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Holiday } from '../../../_coreSecurity/models/holiday.model';
import { HolidayService } from '../../../_coreSecurity/services/holiday.service';

@Component({
  selector: 'app-add-holiday',
  templateUrl: './add-holiday.component.html',
  styleUrls: ['./add-holiday.component.css'],
  standalone: false,
})
export class AddHolidayComponent implements OnInit {
  holiday: Holiday = new Holiday();
  onClose!: Subject<boolean>;
  title = '';
  isSaving: boolean = false;
  sessionList: any[] = [];

  holidayTypes = [
    { value: 'NATIONAL', label: 'National Holiday' },
    { value: 'RELIGIOUS', label: 'Religious Holiday' },
    { value: 'SCHOOL', label: 'School Vacation' },
    { value: 'OPTIONAL', label: 'Optional Holiday' },
  ];

  constructor(
    public bsModalRef: BsModalRef,
    private holidayService: HolidayService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
    this.loadSessions();
    if (!this.holiday.id) {
      this.holiday.activeStatus = 1;
      this.holiday.isRecurring = 0;
    }
  }

  loadSessions() {
    this.holidayService.getAllSessions().subscribe({
      next: (res: any) => (this.sessionList = res.items || []),
    });
  }

  saveHoliday() {
    this.isSaving = true;
    this.toggleValue(this.holiday);

    if (!this.checkValidation()) {
      this.isSaving = false;
      return;
    }

    const req$ = this.holiday.id
      ? this.holidayService.update(this.holiday)
      : this.holidayService.save(this.holiday);

    req$.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success(res.message || 'Holiday saved successfully!');
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
    if (!this.holiday.holidayName) {
      this.toastr.warning("Holiday Name can't be empty!");
      return false;
    }
    if (!this.holiday.fromDate) {
      this.toastr.warning("From Date can't be empty!");
      return false;
    }
    if (!this.holiday.toDate) {
      this.toastr.warning("To Date can't be empty!");
      return false;
    }
    if (!this.holiday.holidayType) {
      this.toastr.warning("Holiday Type can't be empty!");
      return false;
    }
    if (new Date(this.holiday.fromDate) > new Date(this.holiday.toDate)) {
      this.toastr.warning('From Date cannot be after To Date!');
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
