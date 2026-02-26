import * as Highcharts from 'highcharts';
import { Options } from 'highcharts';

export const wardWiseStatsChartOptions: Options = {
  chart: {
    type: 'column'
  },
  title: {
    text: 'Ward Wise Statistics Summary'
  },
  xAxis: {
    categories: [
      'Antenatal Ward',
      'BMT Ward',
      'Cardiology Ward',
      'CCU',
      'Emergency and Trauma',
      'Medical Ward - 1',
      'Nephrology Ward'
    ],
    labels: {
      rotation: -30,
      style: {
        fontSize: '12px'
      }
    }
  },
  // yAxis: {
  //   min: 0,
  //   title: {
  //     text: null
  //   },
  //   allowDecimals: false
  // },
  legend: {
    align: 'center',
    verticalAlign: 'bottom',
    layout: 'horizontal',
    labelFormatter: function () {
      // @ts-ignore
      const total = this.yData?.reduce((a: number, b: number) => a + b, 0) ?? 0;
      return `${this.name} (${total})`;
    }
  },
  plotOptions: {
    column: {
      grouping: true,
      pointPadding: 0.1,
      groupPadding: 0.1,
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        format: '{y}',
        style: {
          color: '#000',
          fontWeight: 'bold'
        }
      }
    }
  },
  series: [
    {
      type: 'column',
      name: 'Admission',
      color: '#E91E63',
      data: [0, 0, 0, 0, 0, 0, 0]
    },
    {
      type: 'column',
      name: 'RB NO',
      color: '#00BCD4',
      data: [0, 0, 0, 0, 0, 0, 0]
    },
    {
      type: 'column',
      name: 'NS Received',
      color: '#4CAF50',
      data: [0, 0, 0, 0, 0, 0, 0]
    },
    {
      type: 'column',
      name: 'Wrist Band',
      color: '#FFC107',
      data: [0, 0, 0, 0, 0, 0, 0]
    },
    {
      type: 'column',
      name: 'Discharge',
      color: '#F44336',
      data: [0, 0, 0, 0, 0, 0, 0]
    }
  ]
};
