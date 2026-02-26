import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Department } from '../../../_coreSecurity/models/department.model';
import { DepartmentService } from '../../../_coreSecurity/services/department.service';

@Component({
  selector: 'app-add-department-modal',
  templateUrl: './add-department-modal.component.html',
  styleUrls: ['./add-department-modal.component.css'],
  standalone: false,
})
export class AddDepartmentModalComponent implements OnInit {
  onClose!: Subject<boolean>;
  title: any;

  districtList: any;
  departmentList: Department[] = [];
  department: Department = new Department();
  reportTypeList!: any[];

  constructor(
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private departmentService: DepartmentService,
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
  }

  onSaveOrUpdate(): void {
    this.department.activeStatus
      ? (this.department.activeStatus = 1)
      : (this.department.activeStatus = 2);

    if (this.department.id) {
      this.updateDepartment();
    } else {
      this.createDepartment();
    }
  }

  createDepartment() {
    this.departmentService
      .createDepartment(this.department)
      .subscribe((res) => {
        if (res.success) {
          this.toastr.success(res.message);
          this.onClose.next(true);
          this.bsModalRef.hide();
        }
      });
  }
  updateDepartment() {
    this.departmentService
      .updateDepartment(this.department)
      .subscribe((res) => {
        if (res.success) {
          this.toastr.success(res.message);
          this.onClose.next(true);
          this.bsModalRef.hide();
        }
      });
  }
}
