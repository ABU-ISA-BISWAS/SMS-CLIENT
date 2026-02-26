import { Component, OnInit, Input } from '@angular/core';
import { EmployeeModel } from '../../../../_coreSecurity/models/employee.model'; 
import { EmployeeService } from '../../../../_coreSecurity/services/employee.service'; 




@Component({
  selector: 'app-address-tab',
  templateUrl: './address-tab.component.html',
  styleUrls: ['./address-tab.component.css'],
    standalone: false,
})
export class AddressTabComponent implements OnInit {


  @Input('district') districtlist: any;
  @Input('country') countryList: any;
  @Input('editAddressTab')
  editAddressTab!: EmployeeModel;

  employeeaddress: EmployeeModel = new EmployeeModel();
  
  constructor(private empService: EmployeeService) {

    this.empService.doctorObject.subscribe(data => {
      this.employeeaddress.prCareOfAddr =data.obj.prCareOfAddress;
      this.employeeaddress.prAddr1 = data.obj.prAddress1;
      this.employeeaddress.prAddr2 = data.obj.prAddress2;
      this.employeeaddress.prAddrPost = data.obj.prAddressPost;
      this.employeeaddress.prAddrDist = data.obj.prAddressDist;
      this.employeeaddress.prAddrCountry = data.obj.prAddressCountry;
      
      this.employeeaddress.peCareOfAddr =data.obj.peCareOfAddr;
      this.employeeaddress.peAddr1 = data.obj.peAddress1;
      this.employeeaddress.peAddr2 = data.obj.peAddress2;
      this.employeeaddress.peAddrPost = data.obj.peAddressPost;
      this.employeeaddress.peAddrDist = data.obj.peAddressDist;
      this.employeeaddress.peAddrCountry = data.obj.peAddressCountry;

      console.log("inside address");
      
    })  
  }

  ngOnInit() {
    if (this.editAddressTab) {
      console.log("inside other tab", this.editAddressTab);
      this.employeeaddress = this.editAddressTab;
    }
  }
  copyPresentAddress() {
    this.employeeaddress.peAddr1 = this.employeeaddress.prAddr1;
    this.employeeaddress.peAddr2 = this.employeeaddress.prAddr2;
    this.employeeaddress.peAddr3 = this.employeeaddress.prAddr3;
    this.employeeaddress.peAddrCountry = this.employeeaddress.prAddrCountry;
    this.employeeaddress.peAddrDist=this.employeeaddress.prAddrDist;
    this.employeeaddress.peAddrPost=this.employeeaddress.prAddrPost;
    this.employeeaddress.peCareOfAddr=this.employeeaddress.prCareOfAddr;
    
  }
}
