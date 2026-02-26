import { Component, OnInit, Input } from '@angular/core';
import { EmployeeModel } from '../../../../_coreSecurity/models/employee.model';
import { EmployeeService } from '../../../../_coreSecurity/services/employee.service';




@Component({
  selector: 'app-official-info-tab',
  templateUrl: './official-info-tab.component.html',
  styleUrls: ['./official-info-tab.component.css'],
  standalone: false,

})
export class OfficialInfoTabComponent implements OnInit {

  @Input('hrType') hrTypeList: any;
  @Input('empType') emptypelist: any;
  @Input('bloodGroup') bloodGroupList: any;
  @Input('religionList') religionList: any;
  @Input()
  editOfficialInfo!: EmployeeModel;


  employee: EmployeeModel = new EmployeeModel();


  constructor(private empService: EmployeeService) {
    this.empService.doctorObject.subscribe(data => {
      this.employee.religion = data.obj.religion;
      this.employee.bloodGrp = data.obj.bloodGroup;
      this.employee.emailOfficial = data.obj.emailOfficial;
      this.employee.nationality = data.obj.nationality;
      this.employee.passportNo = data.obj.passportNo;
    })

  }

  ngOnInit() {
    if (this.editOfficialInfo) {
      console.log("inside other tab", this.editOfficialInfo);
      this.employee = this.editOfficialInfo;
    }

  }

}
