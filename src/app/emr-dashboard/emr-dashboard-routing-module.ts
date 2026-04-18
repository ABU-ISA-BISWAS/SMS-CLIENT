import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/_guard/auth-guard';
import { AnalyticData } from './analytic-data/analytic-data';
import { BackupSyncStatus } from './backup-sync-status/backup-sync-status';
import { Connectivity } from './connectivity/connectivity';
import { DataSyncStatus } from './data-sync-status/data-sync-status';
import { ServerUsage } from './server-usage/server-usage';
import { ServerUsageDetails } from './server-usage/server-usage-details/server-usage-details';
import { UserManagement } from './user-management/user-management';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'connectivity',
    pathMatch: 'full',
  },
  {
    path: 'connectivity',
    canActivate: [AuthGuard],
    component: Connectivity,
    data: {
      featureId: 'EMR01',
      title: '',
    },
  },
  {
    path: 'data-sync-status',
    canActivate: [AuthGuard],
    component: DataSyncStatus,
    data: {
      featureId: 'EMR02',
      title: '',
    },
  },
  {
    path: 'backup-sync-status',
    canActivate: [AuthGuard],
    component: BackupSyncStatus,
    data: {
      featureId: 'EMR03',
      title: '',
    },
  },
  {
    path: 'analytic-data',
    canActivate: [AuthGuard],
    component: AnalyticData,
    data: {
      featureId: 'EMR04',
      title: '',
    },
  },
  {
    path: 'server-usage',
    canActivate: [AuthGuard],
    component: ServerUsage,
    data: {
      featureId: 'EMR05',
      title: '',
    },
  },
  {
    path: 'server-usage/details',
    canActivate: [AuthGuard],
    component: ServerUsageDetails,
    data: {
      featureId: 'EMR06',
      title: '',
    },
  },
  {
    path: 'user-management',
    canActivate: [AuthGuard],
    component: UserManagement,
    data: {
      featureId: 'EMR07',
      title: '',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmrDashboardRoutingModule {}
