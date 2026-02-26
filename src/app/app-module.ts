import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './auth/_guard/auth-guard';
import { NavigationGuard } from './auth/_guard/navigation-guard';
import { FeatureGuard } from './auth/_guard/feature-guard';
import { TokenInterceptorService } from './auth/_service/token-interceptor-service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core-module';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    RouterModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    
  ],
  providers: [
    AuthGuard, NavigationGuard, FeatureGuard,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    provideBrowserGlobalErrorListeners(),
    // provideHighcharts({
    //   instance: () => import('highcharts'),
    //   options: {
    //     title: {
    //       style: {
    //         color: 'tomato'
    //       }
    //     },
    //     legend: {
    //       enabled: false
    //     }
    //   },
    //   modules: () => {
    //     return [
    //       import('highcharts/esm/modules/accessibility'),
    //       import('highcharts/esm/modules/exporting'),
    //       import('highcharts/esm/themes/sunset')
    //     ]
    //   }
    // }),
  ],
  bootstrap: [App]
})
export class AppModule { }
