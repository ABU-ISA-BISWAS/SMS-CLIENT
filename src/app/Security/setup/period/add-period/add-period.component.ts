import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Period } from '../../../_coreSecurity/models/period.model';
import { PeriodService } from '../../../_coreSecurity/services/period.service';
@Component({
  selector: 'app-add-period',
  templateUrl: './add-period.component.html',
  styleUrls: ['./add-period.component.css'],
  standalone: false,
})
export class AddPeriodComponent implements OnInit {
  period: Period = new Period();
  onClose!: Subject<boolean>;
  title = '';
  isSaving: boolean = false;
  shiftList: any[] = [];

  periodTypes = [
    { value: 'CLASS', label: 'Class' },
    { value: 'BREAK', label: 'Break' },
    { value: 'PRAYER', label: 'Prayer' },
    { value: 'ASSEMBLY', label: 'Assembly' },
  ];

  constructor(
    public bsModalRef: BsModalRef,
    private periodService: PeriodService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
    this.loadShifts();
    if (!this.period.id) {
      this.period.activeStatus = 1;
      this.period.periodType = 'CLASSROOM';
    }
  }

  loadShifts() {
    this.periodService.getAllShifts().subscribe({
      next: (res: any) => (this.shiftList = res.items || []),
      error: () => this.toastr.error('Failed to load shifts.'),
    });
  }

  calculateDuration(): void {
    const start = this.period.startTime;
    const end = this.period.endTime;

    if (!start || !end) {
      this.period.duratonMinutes = 0;
      return;
    }

    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    let startTotal = startH * 60 + startM;
    let endTotal = endH * 60 + endM;

    if (endTotal < startTotal) {
      endTotal += 24 * 60;
    }

    this.period.duratonMinutes = endTotal - startTotal;
  }

  savePeriod() {
    this.isSaving = true;
    this.toggleValue(this.period);

    if (!this.checkValidation()) {
      this.isSaving = false;
      return;
    }

    const req$ = this.period.id
      ? this.periodService.update(this.period)
      : this.periodService.save(this.period);

    req$.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success(res.message || 'Period saved successfully!');
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
    if (!this.period.shiftNo) {
      this.toastr.warning("Shift can't be empty!");
      return false;
    }

    if (!this.period.periodType) {
      this.toastr.warning("Period Type can't be empty!");
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
