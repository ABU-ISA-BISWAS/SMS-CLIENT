import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared-module';

import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnalyticData } from './analytic-data/analytic-data';
import { BackupSyncStatus } from './backup-sync-status/backup-sync-status';
import { Connectivity } from './connectivity/connectivity';
import { DataSyncStatus } from './data-sync-status/data-sync-status';
import { EmrDashboardRoutingModule } from './emr-dashboard-routing-module';
import { ServerUsage } from './server-usage/server-usage';
import { ServerUsageDetails } from './server-usage/server-usage-details/server-usage-details';
import { UserManagement } from './user-management/user-management';

@NgModule({
  declarations: [
    Connectivity,
    DataSyncStatus,
    BackupSyncStatus,
    AnalyticData,
    ServerUsage,
    UserManagement,
    ServerUsageDetails,
  ],
  imports: [
    SharedModule,
    EmrDashboardRoutingModule,
    RouterModule,
    CommonModule,
  ],
  providers: [
    // provideHighcharts(Highcharts)
    DatePipe,
  ],
})
export class EmrDashboardModule {}
