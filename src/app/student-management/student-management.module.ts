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
import { AdmissionComponent } from './admission/admission.component';
import { StudentManagementRoutingModule } from './student-management-routing.module';
import { AdmissionDrawerComponent } from './admission/academic-session/admission-drawer/admission-drawer.component';
import { AdmissionListComponent } from './admission/academic-session/admission-list.component';

@NgModule({
  declarations: [
    AdmissionDrawerComponent,
    AdmissionListComponent

  ],
  imports: [
    SharedModule,
    CommonModule,
    StudentManagementRoutingModule,
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
export class StudentManagementModule {}
