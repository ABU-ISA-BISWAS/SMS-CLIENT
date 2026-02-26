import { Options } from 'highcharts';

export const cpuUsageChartOptions: Options = {
	chart: {
		type: 'spline',
		margin: [20, 20, 40, 20],
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
			color: '#6A5ACD',
			enableMouseTracking: true
		}
	},
	series: [{
		type: 'spline',
		name: 'CPU Usage',
	
	
		data: [35, 42, 38, 45, 30, 40, 32, 39, 36, 43, 37, 41, 33, 40, 35]
	}]
};