import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { WeeklyOffService } from '../../_coreSecurity/services/weekly-off.service';

@Component({
  selector: 'app-weekly-off-setup',
  templateUrl: './weekly-off-setup.component.html',
  styleUrls: ['./weekly-off-setup.component.css'],
  standalone: false,
})
export class WeeklyOffSetupComponent implements OnInit {
  weekDays = [
    { dayCode: 1, dayName: 'Sunday', isOff: false },
    { dayCode: 2, dayName: 'Monday', isOff: false },
    { dayCode: 3, dayName: 'Tuesday', isOff: false },
    { dayCode: 4, dayName: 'Wednesday', isOff: false },
    { dayCode: 5, dayName: 'Thursday', isOff: false },
    { dayCode: 6, dayName: 'Friday', isOff: false },
    { dayCode: 7, dayName: 'Saturday', isOff: false },
  ];

  isSaving = false;
  isLoading = false;

  constructor(
    private weeklyOffService: WeeklyOffService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.loadWeeklyOff();
  }

  loadWeeklyOff() {
    this.isLoading = true;
    this.weeklyOffService.getWeeklyOff().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const offDays: any[] = res?.items || [];
        // Already set দিন গুলো tick করুন
        offDays.forEach((off: any) => {
          const day = this.weekDays.find((d) => d.dayCode === off.dayCode);
          if (day) day.isOff = true;
        });
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  saveWeeklyOff() {
    const selectedDays = this.weekDays
      .filter((d) => d.isOff)
      .map((d) => ({ dayCode: d.dayCode, dayName: d.dayName }));

    this.isSaving = true;
    this.weeklyOffService
      .saveWeeklyOff({ offDays: selectedDays })
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.toastr.success(res.message || 'Weekly off days saved!');
          } else {
            this.toastr.warning(res.message || 'Save failed.');
          }
        },
        error: () => this.toastr.error('Something went wrong.'),
      });
  }

  get selectedCount(): number {
    return this.weekDays.filter((d) => d.isOff).length;
  }

  get selectedDayNames(): string {
    return this.weekDays
      .filter((d) => d.isOff)
      .map((d) => d.dayName)
      .join(', ');
  }
}
