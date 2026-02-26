import { Component } from '@angular/core';
import * as Highcharts from 'highcharts'; // Import Highcharts
import { outgoingTrafficChartOptions } from './chart-datas/outgoing-traffic-chart'; // Assuming chart-datas folder
import { incomingTrafficChartOptions } from './chart-datas/incoming-traffic-chart'; // Assuming chart-datas folder


@Component({
  selector: 'app-server-usage-details',
  standalone: false,
  templateUrl: './server-usage-details.html',
  styleUrl: './server-usage-details.css'
})
export class ServerUsageDetails {
  Highcharts: typeof Highcharts = Highcharts; // Make Highcharts available in template

  outgoingTrafficChartOptions = outgoingTrafficChartOptions;
  incomingTrafficChartOptions = incomingTrafficChartOptions;
}