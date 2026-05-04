import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: false,
})
export class ResetPasswordComponent implements OnInit {
  // password view
  iconToggle: boolean = false;
  passwordToggleIcon: string = 'fas fa-eye-slash';
  passViewer: string = 'password';
  password: any;
  confirmPassword: any;
  passMatched: boolean = false;

  @Output() newPassword: EventEmitter<object> = new EventEmitter<object>();
  @Output() confPassword: EventEmitter<object> = new EventEmitter<object>();

  constructor() {}

  ngOnInit() {}

  onChangeNewPword() {
    this.newPassword.emit(this.password);
  }
  onChangeConfPword() {
    this.confPassword.emit(this.confirmPassword);
  }

  //not used
  machPassword() {
    if (this.password == this.confirmPassword) {
      this.passMatched = true;
      this.newPassword.emit(this.password);
    } else {
      this.passMatched = false;
    }
  }

  passwordViewToggle() {
    if (!this.iconToggle) {
      this.passwordToggleIcon = 'fas fa-eye';
      this.passViewer = 'text';
    } else {
      this.passwordToggleIcon = 'fas fa-eye-slash';
      this.passViewer = 'password';
    }
    this.iconToggle = !this.iconToggle;
  }
}
