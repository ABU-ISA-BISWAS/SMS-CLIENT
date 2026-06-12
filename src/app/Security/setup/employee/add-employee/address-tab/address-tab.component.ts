import { Component, Input, OnInit } from '@angular/core';
import { EmployeeModel } from '../../../../_coreSecurity/models/employee.model';

@Component({
  selector: 'app-address-tab',
  templateUrl: './address-tab.component.html',
  styleUrls: ['./address-tab.component.css'],
  standalone: false,
})
export class AddressTabComponent implements OnInit {
  @Input('district') districtlist: any;
  @Input('country') countryList: any;
  @Input('guardianRelationList') guardianRelationList: any;

  // ── Shared model from parent ──────────────────────────
  @Input('sharedEmployee') employeeaddress!: EmployeeModel;

  ngOnInit() {}

  copyPresentAddress() {
    this.employeeaddress.peAddr1 = this.employeeaddress.prAddr1;
    this.employeeaddress.peAddr2 = this.employeeaddress.prAddr2;
    this.employeeaddress.peAddr3 = this.employeeaddress.prAddr3;
    this.employeeaddress.peAddrCountry = this.employeeaddress.prAddrCountry;
    this.employeeaddress.peAddrDist = this.employeeaddress.prAddrDist;
    this.employeeaddress.peAddrPost = this.employeeaddress.prAddrPost;
    this.employeeaddress.peCareOfAddr = this.employeeaddress.prCareOfAddr;
  }
}
