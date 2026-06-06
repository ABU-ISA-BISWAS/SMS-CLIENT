import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SalaryGrade } from '../../../_coreSecurity/models/salary-grade.model';
import { SalaryGradeService } from '../../../_coreSecurity/services/salary-grade.service';

@Component({
  selector: 'app-add-salary-grade',
  templateUrl: './add-salary-grade.component.html',
  styleUrls: ['./add-salary-grade.component.css'],
  standalone: false,
})
export class AddSalaryGradeComponent implements OnInit {
  grade: SalaryGrade = new SalaryGrade();
  onClose!: Subject<boolean>;
  title = '';
  isSaving: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    private salaryGradeService: SalaryGradeService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    console.log('grade::::', this.grade);
    this.onClose = new Subject();
    if (!this.grade.id) {
      this.grade.activeStatus = 1;
      this.grade.houseRentPct = 45;
      this.grade.medicalAllowance = 1500;
      this.grade.transportAllowance = 500;
      this.grade.conveyance = 0;
      this.grade.otherAllowance = 0;
    }
  }

  get grossSalary(): number {
    const basic = this.grade.basicSalary || 0;
    const houseRent = (basic * (this.grade.houseRentPct || 0)) / 100;
    return (
      basic +
      houseRent +
      (this.grade.medicalAllowance || 0) +
      (this.grade.transportAllowance || 0) +
      (this.grade.conveyance || 0) +
      (this.grade.otherAllowance || 0)
    );
  }

  get houseRentAmount(): number {
    return (
      ((this.grade.basicSalary || 0) * (this.grade.houseRentPct || 0)) / 100
    );
  }

  saveGrade() {
    this.isSaving = true;
    this.toggleValue(this.grade);

    if (!this.checkValidation()) {
      this.isSaving = false;
      return;
    }

    const req$ = this.grade.id
      ? this.salaryGradeService.update(this.grade)
      : this.salaryGradeService.save(this.grade);

    req$.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success(
            res.message || 'Salary Grade saved successfully!',
          );
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
    if (!this.grade.gradeCode) {
      this.toastr.warning("Grade Code can't be empty!");
      return false;
    }
    if (!this.grade.gradeName) {
      this.toastr.warning("Grade Name can't be empty!");
      return false;
    }
    if (!this.grade.basicSalary || this.grade.basicSalary <= 0) {
      this.toastr.warning('Basic Salary must be greater than 0!');
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
