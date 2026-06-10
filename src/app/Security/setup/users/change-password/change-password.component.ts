import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UserModel } from '../../../_coreSecurity/models/user.model';
import { UserService } from '../../../_coreSecurity/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  standalone: false,
})
export class ChangePasswordComponent implements OnInit {
  user: UserModel = new UserModel();
  selectedUser: any;
  onClose: Subject<boolean>;

  invalidPassword!: boolean;
  isSaving: boolean = false;
  showPassword: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    private userService: UserService,
    private toastr: ToastrService,
  ) {
    this.onClose = new Subject();
  }

  ngOnInit() {
    this.selectedUser ? (this.user = this.selectedUser) : this.user;
    this.user.password = '';
  }

  changePassword() {
    this.isSaving = true;
    this.invalidPassword = false;

    if (!this.user.password) {
      this.invalidPassword = true;
      this.isSaving = false;
      this.toastr.warning('Please enter a password.');
      return;
    }

    if (this.user.password.length < 6) {
      this.invalidPassword = true;
      this.isSaving = false;
      this.toastr.warning('Password must be at least 6 characters long.');
      return;
    }

    this.userService
      .chagnePasswordByAdmin(this.user)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        }),
      )
      .subscribe({
        next: (res: { success: boolean; message?: string }) => {
          if (res.success) {
            this.toastr.success(
              res.message || 'Password changed successfully!',
            );
            this.onClose.next(true);
            this.bsModalRef.hide();
          } else {
            this.toastr.warning(res.message || 'Failed to change password.');
            this.onClose.next(false);
          }
        },
        error: (err) => {
          this.toastr.error(
            'Something went wrong while changing password. Please try again.',
          );
          this.onClose.next(false);
        },
      });
  }

  validatePass() {
    if (this.user && this.user.password && this.user.password.length >= 6) {
      this.invalidPassword = false;
    }
  }
}
