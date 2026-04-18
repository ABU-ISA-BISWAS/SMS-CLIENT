import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule, TabsetConfig } from 'ngx-bootstrap/tabs';

import { DataTablesModule } from 'angular-datatables';
import { HighchartsChartModule } from 'highcharts-angular';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ConfirmationDialog } from './component/confirmation-dialog/confirmation-dialog';
import { WebCam } from './component/web-cam/web-cam';

@NgModule({
  declarations: [ConfirmationDialog, WebCam],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    TabsModule,
    NgSelectModule,
    HighchartsChartModule,
    AccordionModule,
    BsDatepickerModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    TabsModule,
    NgSelectModule,
    HighchartsChartModule,
    AccordionModule,
    BsDatepickerModule,
  ],
  providers: [TabsetConfig],
})
export class SharedModule {}
