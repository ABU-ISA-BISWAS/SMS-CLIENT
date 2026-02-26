import { Options } from 'highcharts';

export const memoryChartOptions: Options = {
    chart: {
        type: 'spline', // As requested: spline for the first two
        margin: [20, 20, 40, 20], // Adjust margins to fit percentage label and line
        // Explicitly set background to transparent to blend with card body
        backgroundColor: 'transparent'
    },
    title: {
        text: ''
    },
    xAxis: {
        visible: false
    },
    yAxis: {
        min: 0,
        max: 100,
        title: {
            text: ''
        },
        labels: {
            enabled: false
        },
        gridLineWidth: 1,
        plotLines: [{
            color: '#BDBDBD',
            width: 1,
            value: 100,
            dashStyle: 'Dash',
            zIndex: 5
        }]
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        enabled: true,
        pointFormat: '{point.y}%'
    },
    plotOptions: {
        spline: {
            marker: {
                enabled: false
            },
            lineWidth: 2,
            color: '#6A5ACD', // Purple color matching the image
            enableMouseTracking: true
        }
    },
    series: [{
        type: 'spline',
        name: 'Memory Usage',
        // Dummy data for a spline chart that resembles the pattern in the image
        // You would replace this with actual dynamic data
        data: [65, 72, 68, 75, 60, 70, 62, 69, 66, 73, 67, 71, 63, 70, 65]
    }]
};