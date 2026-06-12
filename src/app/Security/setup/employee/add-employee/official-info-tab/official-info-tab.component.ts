import { Component, Input, OnInit } from '@angular/core';
import { EmployeeModel } from '../../../../_coreSecurity/models/employee.model';

@Component({
  selector: 'app-official-info-tab',
  templateUrl: './official-info-tab.component.html',
  styleUrls: ['./official-info-tab.component.css'],
  standalone: false,
})
export class OfficialInfoTabComponent implements OnInit {
  @Input('empType') emptypelist: any;
  @Input('bloodGroup') bloodGroupList: any;
  @Input('religionList') religionList: any;

  // ── Shared model from parent ──────────────────────────
  @Input('sharedEmployee') employee!: EmployeeModel;

  ngOnInit() {
    console.log('///////bloodGroup///////:::::::', this.bloodGroupList);
    console.log('////////religionList//////:::::::', this.religionList);

    console.log('employee.bloodGrp = ', this.employee.bloodGrp);
    console.log('employee.religion = ', this.employee.religion);
  }
}
