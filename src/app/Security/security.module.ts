import { CommonModule, TitleCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from '../shared/shared-module';
import { IconPickerComponent } from './_coreSecurity/common/icon-picker/icon-picker.component';
import { SecurityRoutingModule } from './security-routing.module';
import { AcademicClassComponent } from './setup/academic-class/academic-class.component';
import { AddClassComponent } from './setup/academic-class/add-class/add-class.component';
import { AcademicSessionComponent } from './setup/academic-session/academic-session.component';
import { AddSessionComponent } from './setup/academic-session/add-session/add-session.component';
import { AddBankInfoComponent } from './setup/bankInfo/add-bank-info/add-bank-info.component';
import { BankInfoComponent } from './setup/bankInfo/bank-info.component';
import { AddCompanyComponent } from './setup/companies/add-company/add-company.component';
import { CompaniesComponent } from './setup/companies/companies.component';
import { EditCompanyComponent } from './setup/companies/edit-company/edit-company.component';
import { AddDepartmentModalComponent } from './setup/department-new/add-department-modal/add-department-modal.component';
import { DepartmentNewComponent } from './setup/department-new/department-new.component';
import { AddEmpBankInfoComponent } from './setup/employee/add-emp-bank-info/add-emp-bank-info.component';
import { AddEmpSignatureComponent } from './setup/employee/add-emp-signature/add-emp-signature.component';
import { AddEmployeeComponent } from './setup/employee/add-employee/add-employee.component';
import { AddressTabComponent } from './setup/employee/add-employee/address-tab/address-tab.component';
import { OfficialInfoTabComponent } from './setup/employee/add-employee/official-info-tab/official-info-tab.component';
import { PersonalInfoTabComponent } from './setup/employee/add-employee/personal-info-tab/personal-info-tab.component';
import { EmployeesComponent } from './setup/employee/employees.component';
import { ResetPasswordComponent } from './setup/employee/reset-password/reset-password.component';
import { AddFeatureComponent } from './setup/features/add-feature/add-feature.component';
import { FeaturesComponent } from './setup/features/features.component';
import { AddModuleComponent } from './setup/modules/add-module/add-module.component';
import { ModulesComponent } from './setup/modules/modules.component';
import { AddOrganizationComponent } from './setup/organizations/add-organization/add-organization.component';
import { EditOrganizationComponent } from './setup/organizations/edit-organization/edit-organization.component';
import { OrganizationsComponent } from './setup/organizations/organizations.component';
import { AddRoleNewComponent } from './setup/role-management/add-role-new/add-role-new.component';
import { RoleManagementComponent } from './setup/role-management/role-management.component';
import { SetupComponent } from './setup/setup.component';
import { AddUserComponent } from './setup/users/add-user/add-user.component';
import { ChangePasswordComponent } from './setup/users/change-password/change-password.component';
import { RoleFeaturesModalComponent } from './setup/users/role-features-modal/role-features-modal.component';
import { SubModuleRoleComponent } from './setup/users/sub-module-role/sub-module-role.component';
import { SubModuleComponent } from './setup/users/sub-module/sub-module.component';
import { UsersComponent } from './setup/users/users.component';
@NgModule({
  declarations: [
    SetupComponent,
    FeaturesComponent,
    AddFeatureComponent,
    UsersComponent,
    AddUserComponent,
    EmployeesComponent,
    PersonalInfoTabComponent,
    OfficialInfoTabComponent,
    AddressTabComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    SubModuleComponent,
    IconPickerComponent,
    AddEmpSignatureComponent,
    AddEmpBankInfoComponent,
    AddEmployeeComponent,
    ModulesComponent,
    AddModuleComponent,
    RoleManagementComponent,
    AddRoleNewComponent,
    SubModuleRoleComponent,
    RoleFeaturesModalComponent,
    OrganizationsComponent,
    AddOrganizationComponent,
    EditOrganizationComponent,
    CompaniesComponent,
    EditCompanyComponent,
    AddCompanyComponent,
    DepartmentNewComponent,
    AddDepartmentModalComponent,
    BankInfoComponent,
    AddBankInfoComponent,
    AcademicSessionComponent,
    AddSessionComponent,
    AcademicClassComponent,
    AddClassComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    SecurityRoutingModule,
    TooltipModule.forRoot(),
    NgSelectModule,
    AccordionModule,
    BsDatepickerModule,
    TypeaheadModule,
    FormsModule,
    ReactiveFormsModule,
    TimepickerModule,
    ToastrModule,
    TitleCasePipe,
    RouterModule,
  ],
})
export class SecurityModule {}
