import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { CompanyModel } from '../../../_coreSecurity/models/company.model';
import { CompanyService } from '../../../_coreSecurity/services/company.service';
import { OrganizationService } from '../../../_coreSecurity/services/organization.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css'],
  standalone: false,
})
export class AddCompanyComponent implements OnInit {
  sendCompany!: CompanyModel;
  company: CompanyModel = new CompanyModel();
  onClose!: Subject<boolean>;

  //typeahead related
  organizationDataSource!: Observable<any>;
  orgSelect!: string;
  typeaheadLoading!: boolean;

  constructor(
    public bsModalRef: BsModalRef,
    private companyService: CompanyService,
    private toastr: ToastrService,
    private orgService: OrganizationService,
  ) {}

  ngOnInit() {
    if (this.sendCompany) {
      this.company = this.sendCompany;
    }

    //redraw datagrid
    this.onClose = new Subject();

    // typeahead setup
    //for getting org list
    this.organizationDataSource = Observable.create((observer: any) => {
      observer.next(this.company.ogName);
    }).pipe(mergeMap((token) => this.searchOrgList(token)));
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  searchOrgList(token: any) {
    console.log(token);
    let orgObj = {
      orgName: token.toUpperCase(),
    };
    return this.orgService.findOrgByName(orgObj);
  }

  selectOrg(getVal: any) {
    this.orgSelect = getVal.item;
    this.company.ogName = getVal.item.ogName;
    this.company.ogNo = getVal.item.id;
  }

  addEditCompany() {
    if (this.company.id) {
      this.companyService.updateCompany(this.company).subscribe((res) => {
        console.log('server response', res);
        if (res.success) {
          this.toastr.success(res.message);
          this.onClose.next(true);
          this.bsModalRef.hide();
        }
      });
    } else {
      this.companyService.saveCompany(this.company).subscribe((res) => {
        if (res.success) {
          this.toastr.success(res.message);
          this.onClose.next(true);
          this.bsModalRef.hide();
        }
      });
    }
  }
}
