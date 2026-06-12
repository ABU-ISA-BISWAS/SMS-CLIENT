import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { EmployeeModel } from '../../../../_coreSecurity/models/employee.model';
import { EmployeeService } from '../../../../_coreSecurity/services/employee.service';

@Component({
  selector: 'app-personal-info-tab',
  templateUrl: './personal-info-tab.component.html',
  styleUrls: ['./personal-info-tab.component.css'],
  standalone: false,
})
export class PersonalInfoTabComponent implements OnInit {
  @Input('jobType') jobTypeList: any;
  @Input('maritalStatus') maritalStatus: any;
  @Input('jobTitle') jobTitleList: any;
  @Input('department') departmentList: any;
  @Input('gender') genderList: any;
  @Input('doctorNo') doctorSelect: string | null = null;

  // ── Shared model from parent ──────────────────────────
  @Input('sharedEmployee') employee!: EmployeeModel;

  @Output() imgImmite: EventEmitter<any> = new EventEmitter<any>();

  empNoChecker: boolean = false;
  personalNumberChecker: boolean = false;
  oldEmpId!: string | null;

  //image Procesing
  employeeImgURL: any;
  imageErrorMessage!: string;
  imgFile!: File;

  constructor(
    private empService: EmployeeService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    // Store old empId for duplicate check during edit
    if (this.employee?.id) {
      this.oldEmpId = this.employee.empId;
    }

    if (this.employee && this.employee.id) {
      this.findEmployeePhoto(this.employee.id);
    }
  }

  validateEmpNo(data: string | number | boolean) {
    if (!this.employee.id) {
      this.empService.validateEmpId(data).subscribe((res: { success: any }) => {
        this.empNoChecker = !!res.success;
      });
      return;
    }
    if (this.employee.empId?.toLowerCase() !== this.oldEmpId?.toLowerCase()) {
      this.empService.validateEmpId(data).subscribe((res: { success: any }) => {
        this.empNoChecker = !!res.success;
      });
    }
  }

  processFile(files: any) {
    if (files.length === 0) return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.imageErrorMessage = 'Only image are Supported.';
      return;
    }

    this.imgFile = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.imgFile);
    reader.onload = (_event) => {
      this.employeeImgURL = reader.result;
    };

    this.imgImmite.emit(this.imgFile);
    // this.basicInfo.get('file').setValue(this.file);
  }

  findEmployeePhoto(empNo: any) {
    this.empService.findEmployeePhoto(empNo).subscribe(
      (res) => {
        if (res.success) {
          this.employeeImgURL =
            res.obj != null
              ? this.sanitizer.bypassSecurityTrustResourceUrl(
                  'data:image/*;base64,' + res.obj,
                )
              : null;
        }
      },
      (err) => {
        console.log(' Error ', err);
      },
    );
  }
}
