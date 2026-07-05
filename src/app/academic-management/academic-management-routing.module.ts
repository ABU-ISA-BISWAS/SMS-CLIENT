import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/_guard/auth-guard';
import { ExamScheduleListComponent } from './exam-schedule/exam-schedule-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  {
    path: 'exam-schedule',
    canActivate: [AuthGuard],
    component: ExamScheduleListComponent,
    data: {
      featureId: 'SAS013',
      title: 'Exam Schedule',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule],
})
export class AcademicManagementRoutingModule {}
