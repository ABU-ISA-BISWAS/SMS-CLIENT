import { Options } from 'highcharts';

export const diskUsageChartOptions: Options = {
    chart: {
        type: 'pie', // Pie chart for disk usage
        plotBackgroundColor: '',
        plotBorderWidth: 0,
        plotShadow: false,
        margin: [0, 0, 0, 0], // Minimal margin for a compact look
        // Explicitly set background to transparent to blend with card body
        backgroundColor: 'transparent',
    },
    title: {
        text: '' // No title inside the chart
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: [{
                enabled: true,
                distance: 20
            }, {
                enabled: true,
                distance: -35,
                // format: '{point.name} {point.percentage:.1f}%',
                format: '{point.percentage:.1f}%',
                style: {
                    fontSize: '0.8em',
                    textOutline: 'none',
                    opacity: 0.7
                },
                filter: {
                    operator: '>',
                    property: 'percentage',
                    value: 10
                }
            }],
            colors: ['#6A5ACD', '#F0F0F0']
        }
    },
    credits: {
        enabled: false // No Highcharts credits
    },
    series: [{
        type: 'pie',
        name: 'Disk Usage',
        
        data: [
            {
                name: 'Used',
                y: (70 / 250) * 100 // 70GB used out of 250GB total
            },
            {
                name: 'Free',
                y: ((250 - 70) / 250) * 100 // Remaining free space
            }
        ]
    }]
};