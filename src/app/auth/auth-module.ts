import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared-module';

import { AuthRoutingModule } from './auth-routing-module';
import { Login } from './login/login';
import { TwoFactorAuthModal } from './login/two-factor-auth-modal/two-factor-auth-modal';
import { AuthService } from './_service/auth-service';
import { AuthGuard } from './_guard/auth-guard';
import { NavigationGuard } from './_guard/navigation-guard';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    Login,
    TwoFactorAuthModal
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    RouterModule
  ],

  providers: [AuthService, AuthGuard, NavigationGuard]

})
export class AuthModule { }
