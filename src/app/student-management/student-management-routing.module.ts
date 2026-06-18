import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/_guard/auth-guard';
import { AdmissionListComponent } from './admission/student-admission/admission-list.component';
import { AdmissionProfileComponent } from './admission/student-profile/admission-profile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  // {
  //   path: 'admission',
  //   canActivate: [AuthGuard],
  //   component: AdmissionComponent,
  //   data: {
  //     featureId: 'SM001',
  //     title: 'Addmission',
  //   },
  // },

  {
    path: 'admission/admission-list',
    canActivate: [AuthGuard],
    component: AdmissionListComponent,
    data: {
      featureId: 'SAS013',
      title: 'Admission List',
    },
  },

  // student-routing.module.ts
  {
    path: 'student',
    children: [
      {
        path: 'admission',
        children: [
          { path: '', component: AdmissionListComponent },
          { path: 'profile/:id', component: AdmissionProfileComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule],
})
export class StudentManagementRoutingModule {}
