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
import { AdmissionListComponent } from './admission/student-admission/admission-list.component';
import { StudentManagementRoutingModule } from './student-management-routing.module';

@NgModule({
  declarations: [AdmissionListComponent],
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
