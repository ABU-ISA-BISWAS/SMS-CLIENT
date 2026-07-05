import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/_guard/auth-guard';
import { GrantFeatureResolver } from './auth/_guard/grant-feature-resolver';
import { NavigationGuard } from './auth/_guard/navigation-guard';
import { DashboardComponent } from './auth/dashboard/dashboard.component';
import { DashboardLayout } from './core/layouts/dashboard-layout/dashboard-layout';
import { EmrDashboardLayout } from './core/layouts/emr-dashboard-layout/emr-dashboard-layout';
import { PageNotFound } from './core/pages/page-not-found/page-not-found';
import { Unauthorized } from './core/pages/unauthorized/unauthorized';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayout,
    resolve: { featuresReady: GrantFeatureResolver },
    canActivate: [AuthGuard],
    data: {
      title: 'Home',
    },
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full' },
      {
        path: 'emr-dashboard',
        component: EmrDashboardLayout,
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./emr-dashboard/emr-dashboard-module').then(
            (m) => m.EmrDashboardModule,
          ),
      },
      {
        path: 'security',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./Security/security.module').then((m) => m.SecurityModule),
      },
      {
        path: 'student-management',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./student-management/student-management.module').then(
            (m) => m.StudentManagementModule,
          ),
      },

      {
        path: 'academic-management',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./academic-management/academic-management.module').then(
            (m) => m.AcademicManagementModule,
          ),
      },
    ],
  },
  {
    path: 'auth',
    canActivate: [NavigationGuard],
    loadChildren: () => import('./auth/auth-module').then((m) => m.AuthModule),
  },

  // Wildcard for unmatched routes
  {
    path: '**',
    component: PageNotFound,
    data: {
      title: 'pageNotFound',
    },
  },
  {
    path: 'unauthorized',
    component: Unauthorized,
    data: {
      title: 'unauthorized',
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
