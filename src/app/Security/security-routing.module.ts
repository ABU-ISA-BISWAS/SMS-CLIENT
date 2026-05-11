import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/_guard/auth-guard';
import { AcademicClassComponent } from './setup/academic-class/academic-class.component';
import { AcademicSectionComponent } from './setup/academic-section/academic-section.component';
import { AcademicSessionComponent } from './setup/academic-session/academic-session.component';
import { AcademicShiftComponent } from './setup/academic-shift/academic-shift.component';
import { BankInfoComponent } from './setup/bankInfo/bank-info.component';
import { CompaniesComponent } from './setup/companies/companies.component';
import { DepartmentNewComponent } from './setup/department-new/department-new.component';
import { EmployeesComponent } from './setup/employee/employees.component';
import { FeaturesComponent } from './setup/features/features.component';
import { GroupVersionComponent } from './setup/group-version/group-version.component';
import { ModulesComponent } from './setup/modules/modules.component';
import { OrganizationsComponent } from './setup/organizations/organizations.component';
import { RoleManagementComponent } from './setup/role-management/role-management.component';
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
    path: 'setup/organization',
    canActivate: [AuthGuard],
    component: OrganizationsComponent,
    data: {
      featureId: 'SAS013',
      title: 'Role Setup',
    },
  },
  {
    path: 'setup/company',
    canActivate: [AuthGuard],
    component: CompaniesComponent,
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule],
})
export class SecurityRoutingModule {}
