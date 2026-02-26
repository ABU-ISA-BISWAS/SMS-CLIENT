import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import appointVsPresChart from  './chart-datas/appoint-vs-pres'
import { wardWiseStatsChartOptions } from './chart-datas/ward-wise-chart'
import deptWiseDeathChartOptions from './chart-datas/dept-wise-death-chart';

@Component({
  selector: 'app-analytic-data',
  standalone: false,
  templateUrl: './analytic-data.html',
  styleUrl: './analytic-data.css'
})
export class AnalyticData {

  fromDate:Date = new Date();
  toDate:Date = new Date();
  
  Highcharts = Highcharts;
  
  appointVsPresChartOptions = appointVsPresChart;
  wardWiseStatsChartOptions = wardWiseStatsChartOptions;
  deptWiseDeathChartOptions = deptWiseDeathChartOptions;

}
