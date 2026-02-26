import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: false,
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.css'
})
export class ConfirmationDialog implements OnInit{

  public onClose!: Subject<boolean>;
  title!: string;
  public sendCancelReason!: Subject<string>;
  cancelReason!: string;
  cancelFlag!: boolean;
  cancelReasonChecker: boolean = false;

  // opd registration unit check validation
  personalNumber!: string;
  validationString!: string;
  // disables yes button on init. set to false when validationString matches personalNumber
  unitCheck: boolean = false;

  constructor(private _bsModalRef: BsModalRef) { }

  public ngOnInit(): void {
    this.onClose = new Subject();
    this.sendCancelReason = new Subject();

    // disable "yes" button if no cancel reason is given
    if (this.cancelFlag && !this.cancelReason) {
      this.cancelReasonChecker = true
    }
  }

  
  public onConfirm(): void {
    this.onClose.next(true);
    if (this.cancelFlag) {
      this.sendCancelReason.next(this.cancelReason)
    }
    this._bsModalRef.hide();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this._bsModalRef.hide();
  }

}
