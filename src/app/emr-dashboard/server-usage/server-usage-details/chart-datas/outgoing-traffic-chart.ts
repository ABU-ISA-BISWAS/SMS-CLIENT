import { Options } from 'highcharts';

export const outgoingTrafficChartOptions: Options = {
    chart: {
        type: 'line',
        height: 250, // Adjust height to fit within the accordion
        // backgroundColor: 'transparent' // Uncomment if you want transparent background
    },
    title: {
        text: undefined // Title is in the accordion heading
    },
    xAxis: {
        categories: [
            '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
            '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'
        ],
        // Rotate labels for better readability if they overlap
        labels: {
            rotation: -45,
            align: 'right'
        },
        tickInterval: 3, // Show every 3rd label to avoid clutter, adjust as needed
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        max: 750, // Based on the image's Y-axis maximum
        title: {
            text: '' // No Y-axis title
        },
        labels: {
            format: '{value} MB' // Format Y-axis labels with 'MB'
        }
    },
    legend: {
        enabled: false // No legend in the image
    },
    credits: {
        enabled: false // Hide Highcharts credits
    },
    tooltip: {
        pointFormat: '{point.y} MB' // Tooltip shows value with 'MB'
    },
    plotOptions: {
        line: {
            marker: {
                enabled: true, // Markers are visible at data points
                radius: 4,
                symbol: 'circle'
            },
            lineWidth: 2,
            color: '#6A5ACD' // Purple color from the image
        }
    },
    series: [{
        type: 'line',
        name: 'Outgoing Traffic',
        // Dummy data based on the visual pattern in the image.
        // You will replace this with actual data.
        data: [
            10, 0, 10, 0, 0, 200, 0, 10, 0, 0, 230, 0,
            150, 0, 10, 0, 0, 200, 550, 100, 0, 0, 10, 0, 220, 0
        ]
    }]
};