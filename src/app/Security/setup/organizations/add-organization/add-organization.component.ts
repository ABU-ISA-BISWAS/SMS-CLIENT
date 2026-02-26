import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { OrganizationModel } from '../../../_coreSecurity/models/organization.model';
import { OrganizationService } from '../../../_coreSecurity/services/organization.service';

@Component({
  selector: 'app-add-organization',
  templateUrl: './add-organization.component.html',
  styleUrls: ['./add-organization.component.css'],
  standalone: false,
})
export class AddOrganizationComponent implements OnInit {
  orgData: OrganizationModel = new OrganizationModel();
  title: string = '';
  sendOrg!: OrganizationModel;
  onClose!: Subject<boolean>;

  constructor(
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private orgService: OrganizationService,
  ) {}

  ngOnInit() {
    if (this.sendOrg) {
      console.log('on update', this.sendOrg);
      this.orgData = this.sendOrg;
    }
    this.onClose = new Subject();
  }

  // CRUD operation
  addEditOrganization() {
    if (this.sendOrg) {
      this.orgService.updateOrg(this.orgData).subscribe((res) => {
        console.log('server response', res);
        if (res.success) {
          this.toastr.success(res.message);
          this.onClose.next(true);
          this.bsModalRef.hide();
        }
      });
    } else {
      console.log('save org', this.orgData);
      this.orgService.saveOrg(this.orgData).subscribe((res) => {
        console.log('server response', res);
        if (res.success) {
          this.toastr.success(res.message);
          this.onClose.next(true);
          this.bsModalRef.hide();
        }
      });
    }
  }
}
