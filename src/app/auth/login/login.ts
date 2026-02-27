import {
  AfterViewInit,
  Component,
  DOCUMENT,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_service/auth-service';
import { UtilsService } from '../_service/utils.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, AfterViewInit {
  loginForm!: FormGroup;
  @ViewChild('userNameRef') userNameRef: ElementRef = {} as ElementRef;

  openTwoFactAuth: boolean = false;

  public showErrorMessage: boolean = false;
  public errorMessage: string = '';
  isLoading: boolean = false;
  companyInfo: any;

  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private utilsService: UtilsService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit() {
    this.getCompany();
    this.isLoadingStatus();
    this.isMessStatus();

    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.initFocus();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.obtainAccessToken(this.loginForm.value);
    }
  }

  isLoadingStatus(): void {
    this.authService
      .loadingStatus()
      .subscribe((isLoading: boolean) => (this.isLoading = isLoading));
  }

  isMessStatus(): void {
    this.authService.messStatus().subscribe((errorMgs: string) => {
      if (errorMgs == '') {
        this.showErrorMessage = false;
        this.errorMessage = errorMgs;
      } else {
        this.showErrorMessage = true;
        this.errorMessage = errorMgs;
        this.initFocus();
      }
    });
  }

  initFocus() {
    this.userNameRef.nativeElement.focus();
    this.userNameRef.nativeElement.select();
  }

  // login() {
  //   this._router.navigate(['/dashboard']);
  // }

  openTwoFactorAuthModal() {
    this.openTwoFactAuth = !this.openTwoFactAuth;
  }

  async getCompany() {
    this.companyInfo = await this.utilsService.getCustomCompanyInfo();

    // console.log("login component", this.companyInfo);

    if (this.companyInfo) {
      const html = this.document.querySelector('html');

      if (html) {
        html.classList.add(this.companyInfo.companyClassName);
      }

      // this.companyInfo = company;
      // this.document.querySelector('html').classList.add(this.companyInfo.companyClassName);

      localStorage.removeItem('companyClassName');
      localStorage.setItem(
        'companyClassName',
        this.companyInfo.companyClassName,
      );

      // localStorage.removeItem("PatientPortalClassName");
      // console.log("this.companyInfo?.login_sidebar_info", this.companyInfo)
    }
  }
}
