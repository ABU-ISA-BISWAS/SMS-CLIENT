import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { BankInfoModel } from '../../../_coreSecurity/models/bank-info.model';
import { BankInfoService } from '../../../_coreSecurity/services/bank-info-service';

@Component({
  selector: 'app-add-bank-info',
  templateUrl: './add-bank-info.component.html',
  styleUrls: ['./add-bank-info.component.css'],
  standalone: false,
})
export class AddBankInfoComponent implements OnInit {
  bankInfoModel: BankInfoModel = new BankInfoModel();
  parentModuleList: any;
  onClose!: Subject<boolean>;
  validate!: boolean;
  title = '';
  bankAccTypeList: any[] = [];
  activeStatus = '1';

  constructor(
    public bsModalRef: BsModalRef,
    private bankInfoService: BankInfoService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
    this.getBankAccountTypeDataList();
  }

  saveBankInfo(): void {
    if (this.bankInfoModel.id) {
      this.bankInfoService
        .updateBankInformation(this.bankInfoModel)
        .subscribe((res) => {
          if (!res.success) {
            this.onClose.next(false);
            this.validate = true;
          } else {
            this.toastr.success(res.message);
            this.onClose.next(true);
            this.bsModalRef.hide();
          }
        });
    } else {
      this.bankInfoService
        .saveBankInformation(this.bankInfoModel)
        .subscribe((res) => {
          if (!res.success) {
            this.onClose.next(false);
            this.validate = true;
          } else {
            this.toastr.success(res.message);
            console.log('when saving bankInfoModel', this.bankInfoModel, res);
            this.onClose.next(true);
            this.bsModalRef.hide();
          }
        });
    }
  }

  getBankAccountTypeDataList(): any {
    const reqObj: any = {};
    this.bankInfoService.findBankAccountTypeList(reqObj).subscribe(
      (resp) => {
        if (resp.success) {
          this.bankAccTypeList = resp.items;
          console.log('Bank Account Type  found.', this.bankAccTypeList);
        } else {
          console.log('Bank Account Type not found.');
        }
      },
      (err) => {
        console.log('HTTP Error for Bank Account Type Data.');
      },
    );
  }
}
