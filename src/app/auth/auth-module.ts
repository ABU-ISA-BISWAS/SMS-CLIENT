import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared-module';

import { RouterModule } from '@angular/router';
import { AuthGuard } from './_guard/auth-guard';
import { NavigationGuard } from './_guard/navigation-guard';
import { AuthService } from './_service/auth-service';
import { AuthRoutingModule } from './auth-routing-module';
import { FindAccountComponent } from './login-forgot-password/find-account/find-account.component';
import { LoginForgotPasswordComponent } from './login-forgot-password/login-forgot-password.component';
import { ResetPasswordComponent } from './login-forgot-password/reset-password/reset-password.component';
import { SecurityCodeComponent } from './login-forgot-password/security-code/security-code.component';
import { SelectUserComponent } from './login-forgot-password/select-user/select-user.component';
import { SendOtpComponent } from './login-forgot-password/send-otp/send-otp.component';
import { Login } from './login/login';
import { TwoFactorAuthModal } from './login/two-factor-auth-modal/two-factor-auth-modal';

@NgModule({
  declarations: [
    Login,
    TwoFactorAuthModal,
    LoginForgotPasswordComponent,

    SendOtpComponent,

    SelectUserComponent,

    SecurityCodeComponent,

    ResetPasswordComponent,

    FindAccountComponent,
  ],
  imports: [SharedModule, AuthRoutingModule, RouterModule],

  providers: [AuthService, AuthGuard, NavigationGuard],
})
export class AuthModule {}
