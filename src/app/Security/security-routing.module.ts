import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/_guard/auth-guard';
import { AcademicClassComponent } from './setup/academic-class/academic-class.component';
import { AcademicSectionComponent } from './setup/academic-section/academic-section.component';
import { AcademicSessionComponent } from './setup/academic-session/academic-session.component';
import { AcademicShiftComponent } from './setup/academic-shift/academic-shift.component';
import { BankInfoComponent } from './setup/bankInfo/bank-info.component';
import { ClassSubjectMappingComponent } from './setup/class-subject-mapping/class-subject-mapping.component';
import { DepartmentNewComponent } from './setup/department-new/department-new.component';
import { EmployeesComponent } from './setup/employee/employees.component';
import { FeaturesComponent } from './setup/features/features.component';
import { FeeStructureComponent } from './setup/fee-structure/fee-structure.component';
import { GroupVersionComponent } from './setup/group-version/group-version.component';
import { GuardianRelationComponent } from './setup/guardian-relation/guardian-relation.component';
import { HolidayComponent } from './setup/holiday/holiday.component';
import { ModulesComponent } from './setup/modules/modules.component';
import { RoleManagementComponent } from './setup/role-management/role-management.component';
import { SmsTemplateComponent } from './setup/sms-template/sms-template.component';
import { StudentCategoryComponent } from './setup/student-category/student-category.component';
import { SubjectMasterComponent } from './setup/subject-master/subject-master.component';
import { SystemConfigComponent } from './setup/system-config/system-config.component';
import { UsersComponent } from './setup/users/users.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  // {
  //   path: 'setup',
  //   canActivate: [AuthGuard],
  //   component: SetupComponent,
  //   data: {
  //     featureId: 'SAS001',
  //     title: 'Setup',
  //   },
  // },

  {
    path: 'setup/feature',
    canActivate: [AuthGuard],
    component: FeaturesComponent,
    data: {
      featureId: 'SAS002',
      title: 'Feature Setup',
    },
  },
  {
    path: 'setup/employee',
    canActivate: [AuthGuard],
    component: EmployeesComponent,
    data: {
      featureId: 'SAS003',
      title: 'Employee Setup',
    },
  },
  {
    path: 'setup/user',
    canActivate: [AuthGuard],
    component: UsersComponent,
    data: {
      featureId: 'SAS004',
      title: 'User List',
    },
  },

  {
    path: 'setup/module',
    canActivate: [AuthGuard],
    component: ModulesComponent,
    data: {
      featureId: 'SAS009',
      title: 'Module Setup',
    },
  },

  {
    path: 'setup/role',
    canActivate: [AuthGuard],
    component: RoleManagementComponent,
    data: {
      featureId: 'SAS013',
      title: 'Role Setup',
    },
  },

  {
    path: 'setup/department',
    canActivate: [AuthGuard],
    component: DepartmentNewComponent,
    data: {
      featureId: 'SAS013',
      title: 'Role Setup',
    },
  },

  {
    path: 'setup/bank',
    canActivate: [AuthGuard],
    component: BankInfoComponent,
    data: {
      featureId: 'SAS013',
      title: 'Role Setup',
    },
  },

  {
    path: 'setup/academic-session',
    canActivate: [AuthGuard],
    component: AcademicSessionComponent,
    data: {
      featureId: 'SAS013',
      title: 'Academic Session Setup',
    },
  },
  {
    path: 'setup/academic-class',
    canActivate: [AuthGuard],
    component: AcademicClassComponent,
    data: {
      featureId: 'SAS013',
      title: 'Academic Class Setup',
    },
  },

  {
    path: 'setup/academic-section',
    canActivate: [AuthGuard],
    component: AcademicSectionComponent,
    data: {
      featureId: 'SAS013',
      title: 'Academic Section Setup',
    },
  },

  {
    path: 'setup/academic-shift',
    canActivate: [AuthGuard],
    component: AcademicShiftComponent,
    data: {
      featureId: 'SAS013',
      title: 'Academic Shift Setup',
    },
  },

  {
    path: 'setup/group-version',
    canActivate: [AuthGuard],
    component: GroupVersionComponent,
    data: {
      featureId: 'SAS013',
      title: 'Group / Version Setup',
    },
  },

  {
    path: 'setup/guardian-relation',
    canActivate: [AuthGuard],
    component: GuardianRelationComponent,
    data: {
      featureId: 'SAS013',
      title: 'Guardian Relation Setup',
    },
  },

  {
    path: 'setup/student-category',
    canActivate: [AuthGuard],
    component: StudentCategoryComponent,
    data: {
      featureId: 'SAS013',
      title: 'Student Category Setup',
    },
  },
  {
    path: 'setup/subject-master',
    canActivate: [AuthGuard],
    component: SubjectMasterComponent,
    data: {
      featureId: 'SAS013',
      title: 'Subject Master Setup',
    },
  },
  {
    path: 'setup/class-subject-mapping',
    canActivate: [AuthGuard],
    component: ClassSubjectMappingComponent,
    data: {
      featureId: 'SAS013',
      title: 'Class Subject Mapping Setup',
    },
  },
  {
    path: 'setup/fee-structure',
    canActivate: [AuthGuard],
    component: FeeStructureComponent,
    data: {
      featureId: 'SAS013',
      title: 'Fee Structure',
    },
  },

  {
    path: 'setup/system-config',
    canActivate: [AuthGuard],
    component: SystemConfigComponent,
    data: {
      featureId: 'SAS013',
      title: 'System Config',
    },
  },
  {
    path: 'setup/sms-template',
    canActivate: [AuthGuard],
    component: SmsTemplateComponent,
    data: {
      featureId: 'SAS013',
      title: 'Sms Template',
    },
  },
  {
    path: 'setup/holiday',
    canActivate: [AuthGuard],
    component: HolidayComponent,
    data: {
      featureId: 'SAS013',
      title: 'Holiday',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule],
})
export class SecurityRoutingModule {}
