import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OtpRequest } from '../_model/otpRequest.model';
import { AuthService } from '../_service/auth-service';
import { ForgotPasswordService } from '../_service/forgot-password.service';

@Component({
  selector: 'app-login-forgot-password',
  templateUrl: './login-forgot-password.component.html',
  styleUrls: [
    '../../../assets/css/variables.css',
    './login-forgot-password.component.css',
  ],
  standalone: false,
})
export class LoginForgotPasswordComponent implements OnInit {
  searchParam!: string;
  fildset!: number;
  userList: any[] = [];
  selectedUser: any;
  sendOtpReqObject: OtpRequest = new OtpRequest();
  otpCode: any = '';
  link: any;
  password!: string;
  confirmPassword!: string;
  passMatched: number = 0;
  referenceKey!: string;
  otpReferenceUserName!: string;
  sendType: any;
  sendTo: any;
  userObj: any = {};

  loginCustomLayout: any = {};

  searchLoading: boolean = false;
  userSelectLoader: boolean = false;
  otpCreatLoader: boolean = false;
  otpCheckLoader: boolean = false;
  resetPassLoader: boolean = false;
  resetOtpLoader: boolean = false;
  isInvalidOtp: boolean = true;

  constructor(
    private forgotPasswordService: ForgotPasswordService,
    private toastr: ToastrService,
    private authService: AuthService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit() {
    this.getCompany();

    this.isLoadingStatus();

    this.fildset = 1;
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['otpCode'] && params['otpReferenceKey']) {
        this.otpCode = params['otpCode'];
        this.referenceKey = params['otpReferenceKey'];
        this.otpReferenceUserName = params['otpReferenceUserName'];

        this.sendOtpReqObject.otpCodeSendType = params['otpCodeSendType'];
        this.sendOtpReqObject.sendTo = params['sendTo'];
        this.sendOtpReqObject.userFullName = params['userFullName'];
        this.sendOtpReqObject.userNo = params['userNo'];
        this.sendOtpReqObject.companyNo = params['companyNo'];
        this.sendOtpReqObject.organizationNo = params['organizationNo'];
        this.sendOtpReqObject.otpReferenceKey = this.referenceKey;
        this.sendOtpReqObject.otpReferenceUserName = this.otpReferenceUserName;
        this.sendOtpReqObject.otpServicePoint = 'Forgot Password';

        this.checkOtp();
      }
    });
  }

  getSearchParam(obj: any) {
    this.searchParam = obj;
  }
  getUserData(user: any) {
    this.selectedUser = user;
    this.referenceKey = this.selectedUser.userId;
    this.otpReferenceUserName = this.selectedUser.userName;
  }

  onClickSearch() {
    this.searchLoading = true;
    if (!this.searchParam) {
      this.toastr.warning('Please enter your email or phone or user name !!');
    }

    const reqObj = {
      searchParam: this.searchParam,
    };

    this.forgotPasswordService.searchUser(reqObj).subscribe(
      (res: { success: any; items: any[] }) => {
        if (res.success && res.items) {
          this.userList = res.items;

          this.fildset = this.userList.length > 1 ? 2 : 3;

          if (this.userList.length == 1) {
            this.selectedUser = this.userList[0];
            this.referenceKey = this.selectedUser.userId;
            this.otpReferenceUserName = this.selectedUser.userName;
          }
          this.searchLoading = false;
        } else {
          this.searchLoading = false;
          this.toastr.warning('No user found!!');
        }
      },
      (err: any) => {
        this.searchLoading = false;
        console.error('seaarch user error :: ', err);
      },
    );
  }

  cancel() {
    this.fildset = 1;
  }

  onClickUser() {
    this.userSelectLoader = true;
    if (this.selectedUser) {
      this.fildset = 3;
      this.userSelectLoader = false;
    } else {
      this.userSelectLoader = false;
      this.toastr.warning('Please select user!!');
    }
  }

  onSelectType(reqObj: OtpRequest) {
    this.sendOtpReqObject = reqObj;
  }

  createOtp() {
    this.otpCreatLoader = true;
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['otpCode'] && params['otpReferenceKey']) {
        this.otpCode = params['otpCode'];
        this.referenceKey = params['otpReferenceKey'];
        this.otpReferenceUserName = params['otpReferenceUserName'];

        this.sendOtpReqObject.otpCodeSendType = params['otpCodeSendType'];
        this.sendOtpReqObject.sendTo = params['sendTo'];
        this.sendOtpReqObject.userFullName = params['userFullName'];
        this.sendOtpReqObject.userNo = params['userNo'];
        this.sendOtpReqObject.companyNo = params['companyNo'];
        this.sendOtpReqObject.organizationNo = params['organizationNo'];
        this.sendOtpReqObject.otpReferenceKey = this.referenceKey;
        this.sendOtpReqObject.otpReferenceUserName = this.otpReferenceUserName;
        this.sendOtpReqObject.otpServicePoint = 'Forgot Password';

        this.checkOtp();
      }
    });
    if (this.sendOtpReqObject) {
      this.forgotPasswordService.createOtp(this.sendOtpReqObject).subscribe(
        (res: any) => {
          if (res.success) {
            this.fildset = 4;
            this.otpCreatLoader = false;
            this.toastr.success(res.message);
          } else {
            this.otpCreatLoader = false;
          }
        },
        (err: any) => {
          this.otpCreatLoader = false;
          console.error('send otp error', err);
        },
      );
    }
  }

  resendOtp() {
    // this.sendOtpReqObject.urlRoot =  window.location.href;
    // console.log("resend OTP *****");
    this.resetOtpLoader = true;
    this.createOtp();
  }

  inputOtpCode(otp: string | any[]) {
    if (otp.length == 4) {
      this.isInvalidOtp = false;
      this.otpCode = otp;
    } else {
      this.isInvalidOtp = true;
    }
  }

  checkOtp() {
    this.isInvalidOtp = true;
    this.otpCheckLoader = true;
    const reqObj = {
      otpCode: this.otpCode,
      otpReferenceKey: this.referenceKey, //"MH112106000324"
      otpReferenceUserName: this.otpReferenceUserName,
    };
    this.forgotPasswordService.checkOtp(reqObj).subscribe(
      (res: any) => {
        if (res.success) {
          this.toastr.success(res.message);
          this.fildset = 5;
          this.otpCheckLoader = false;
        } else {
          this.fildset = 4;
          this.otpCheckLoader = false;
          this.toastr.warning(res.message);
          this.router.navigate(['login-forgot/']);
        }
      },
      (err: any) => {
        this.fildset = 1;
        this.otpCheckLoader = false;
        this.isInvalidOtp = true;
        console.error('otp check error', err);
      },
    );
  }

  newPassword(pass: string) {
    this.password = pass;
    this.machPassword();
  }
  confPassword(pass: string) {
    this.confirmPassword = pass;
    this.machPassword();
  }

  machPassword() {
    if (this.password && this.confirmPassword) {
      if (this.password == this.confirmPassword) {
        this.passMatched = 1;
      } else {
        this.passMatched = 0;
      }
    }
  }

  resetPassword() {
    const reqObj = {
      otpCode: this.otpCode,
      otpReferenceKey: this.referenceKey, //"MH112106000324"
      otpReferenceUserName: this.otpReferenceUserName,
      newPassword: this.password,
    };
    // console.log("****.",reqObj);

    if (!this.password || !this.confirmPassword) {
      this.toastr.warning('Please enter password!!');
      return;
    }

    if (this.passMatched == 1) {
      this.resetPassLoader = true;
      this.forgotPasswordService.resetPassword(reqObj).subscribe(
        (res: any) => {
          if (res.success) {
            // const reqObj = {
            //   "userName" : this.referenceKey,
            //   "password" : this.password,
            // }
            //this.userObj.userName =  this.referenceKey;
            this.userObj.userName = this.otpReferenceUserName;
            this.userObj.password = this.password;

            this.authService.obtainAccessToken(this.userObj);
            this.resetPassLoader = false;
          } else {
            this.resetPassLoader = false;
            this.toastr.warning(res.message);
          }
        },
        (err: any) => {
          this.resetPassLoader = false;
          console.error('password reset error', err);
        },
      );
    } else {
      this.toastr.warning('password not matched!!');
    }
  }

  isLoadingStatus(): void {
    this.authService
      .loadingStatus()
      .subscribe((isLoading: boolean) => (this.resetPassLoader = isLoading));
  }

  getCompany() {
    this.authService
      .getLoginCustomLayoutInfo()
      .subscribe((resp: { success: any; obj: any }) => {
        if (resp.success && resp.obj) {
          for (var company of resp.obj) {
            if (company.activeStatus === 1) {
              this.loginCustomLayout = company;
              this.loginCustomLayout = company;
              this.document
                .querySelector('html')
                ?.classList.add(company.companyClassName);
            }
          }
        }
      });
  }
}
