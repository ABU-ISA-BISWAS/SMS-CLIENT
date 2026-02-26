import * as Highcharts from 'highcharts';

const appointVsPresChart: Highcharts.Options = {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Appointment vs Prescription'
    },
    xAxis: {
        categories: ['']
    },
    yAxis: {
        title: {
            text: 'Values'
        },
    },
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
            grouping: true,     // side-by-side bars
            groupPadding: 0.05, // minimal gap between bars
            pointPadding: 0,    // bars fill the space
            borderWidth: 0,
            pointWidth: 100,
            dataLabels: {
                enabled: true,
                format: '{y}',
                style: {
                    fontWeight: 'bold',
                    color: '#252525'
                }
            }
        }
    },
    series: [
        {
            type: 'column',
            name: 'Appointment',
            data: [20],
            color: '#FF5733'
        },
        {
            type: 'column',
            name: 'Prescription',
            data: [18],
            color: '#3375FF'
        }
    ]
};


export default appointVsPresChart;