import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-security-code',
  templateUrl: './security-code.component.html',
  styleUrls: ['./security-code.component.css'],
  standalone: false,
})
export class SecurityCodeComponent implements OnInit {
  @Input() userInfo: any;
  @Input()
  otpLoader: boolean = false;

  @Output() otpCode: EventEmitter<object> = new EventEmitter<object>();
  @Output() resendOtp: EventEmitter<object> = new EventEmitter<object>();

  constructor() {}

  ngOnInit() {
    // console.log("SecurityCodeComponent", this.userInfo);
  }

  keyPressOtp(event: any) {
    // console.log("selected user chield",user);
    this.otpCode.emit(event.target.value);
  }

  onClickResend() {
    this.resendOtp.emit();
  }
}
