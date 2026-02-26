import { Options } from 'highcharts';

const deptWiseDeathChartOptions: Options = {
    chart: {
        type: 'line',
    },
    title: {
        text: '',
    },
    xAxis: {
        categories: [
            '10-Nov',
            '11-Nov',
            '12-Nov',
            '13-Nov',
            '14-Nov',
            '15-Nov',
            '16-Nov',
            '17-Nov',
            '18-Nov',
            '19-Nov',
        ],
        title: {
            text: 'Date',
        },
    },
    yAxis: {
        title: {
            text: 'Number of Deaths',
        },
        min: 0,
        allowDecimals: false,
    },
    tooltip: {
        valueSuffix: ' Deaths',
    },
    plotOptions: {
        line: {
            dataLabels: {
                enabled: true,
            },
            enableMouseTracking: true,
        },
    },
    series: [
        {
            type: 'line',
            // name: 'Cardiology',
            data: [1, 5, 4, 11, 7, 9, 5, 17, 14, 20],
            color: '#4679F9',
        },
    ],
};

export default deptWiseDeathChartOptions;
