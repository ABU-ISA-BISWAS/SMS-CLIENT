import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { TabsetConfig } from 'ngx-bootstrap/tabs';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ToastrModule } from 'ngx-toastr';

import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { SideNav } from './layouts/dashboard-layout/side-nav/side-nav';
import { TopNav } from './layouts/dashboard-layout/top-nav/top-nav';
import { EmrDashboardLayout } from './layouts/emr-dashboard-layout/emr-dashboard-layout';
import { EmrTopNav } from './layouts/emr-dashboard-layout/emr-top-nav/emr-top-nav';
import { MenuListItemComponent } from './menu-list-item/menu-list-item.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PageNotFound } from './pages/page-not-found/page-not-found';
import { Unauthorized } from './pages/unauthorized/unauthorized';
// import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    ToastrModule.forRoot(),
    RouterModule,
    CommonModule,

    // HttpClientModule
  ],
  declarations: [
    DashboardLayout,
    EmrDashboardLayout,
    TopNav,
    SideNav,
    EmrTopNav,
    PageNotFound,
    Unauthorized,
    MenuListItemComponent,
    NavigationComponent,
  ],
  exports: [
    ModalModule,
    BsDatepickerModule,
    TypeaheadModule,
    ToastrModule,
    // HttpClientModule,
    DashboardLayout,
    EmrDashboardLayout,
    PageNotFound,
    Unauthorized,
  ],
  providers: [
    BsModalRef,
    BsModalService,
    BsLocaleService,
    TabsetConfig,
    provideHttpClient(),
  ],
})
export class CoreModule {
  // Prevent re-import
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import only in AppModule.',
      );
    }
  }
}
