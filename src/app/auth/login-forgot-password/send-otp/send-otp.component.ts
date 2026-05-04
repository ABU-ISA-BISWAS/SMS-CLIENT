import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ForgotPasswordService } from '../../_service/forgot-password.service';

@Component({
  selector: 'app-send-otp',
  templateUrl: './send-otp.component.html',
  styleUrls: ['./send-otp.component.css'],
  standalone: false,
})
export class SendOtpComponent implements OnInit {
  @Input() selectedUser: any;
  @Output() sendObj: EventEmitter<object> = new EventEmitter<object>();

  constructor(private forgotPasswordService: ForgotPasswordService) {}

  ngOnInit() {}

  selectType(sendType: any) {
    let reaqObj = {
      otpServicePoint: 'Forgot Password',
      otpCodeSendType: sendType,
      otpReferenceKey: this.selectedUser.userId,
      otpReferenceUserName: this.selectedUser.userName,
      sendTo:
        sendType == 1 ? this.selectedUser.email : this.selectedUser.mobileNo,
      userNo: this.selectedUser.id,
      companyNo: this.selectedUser.companyNo,
      organizationNo: this.selectedUser.organizationNo,
      userFullName: this.selectedUser.userFullName,
      urlRoot: window.location.href,
    };
    this.sendObj.emit(reaqObj);
  }
}
