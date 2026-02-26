import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { bandwidthChartOptions } from './chat-datas/bandwidth-chart';
import { cpuUsageChartOptions } from './chat-datas/cpu-usage-chart';
import { diskUsageChartOptions } from './chat-datas/disk-usage-chart';
import { memoryChartOptions } from './chat-datas/memory-chart';


@Component({
  selector: 'app-server-usage',
  standalone: false,
  templateUrl: './server-usage.html',
  styleUrl: './server-usage.css'
})
export class ServerUsage {

  fromDate:Date = new Date();
  toDate  :Date = new Date();
  
  Highcharts = Highcharts;
  
  cpuUsageChartOptions  = cpuUsageChartOptions;
  memoryChartOptions    = memoryChartOptions;
  diskUsageChartOptions = diskUsageChartOptions;
  bandwidthChartOptions = bandwidthChartOptions;

}
