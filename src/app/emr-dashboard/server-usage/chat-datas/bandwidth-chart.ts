import { Options } from 'highcharts';

export const bandwidthChartOptions: Options = {
    chart: {
        type: 'pie', // Pie chart for bandwidth
        // plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        margin: [0, 0, 0, 0], // Minimal margin for a compact look
        // Explicitly set background to transparent to blend with card body
        backgroundColor: 'transparent'
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
        enabled: false
    },
    series: [{
        type: 'pie',
        name: 'Bandwidth Usage',
        data: [
            {
                name: 'Used',
                y: (20 / 50) * 100 // 20MB used out of 50MB total
            },
            {
                name: 'Free',
                y: ((50 - 20) / 50) * 100 // Remaining free bandwidth
            }
        ]
    }]
};