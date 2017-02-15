import { Chart } from 'react-google-charts';
import React from 'react';

export default class ExampleChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			options:{
				title: this.props.chartTitle,
				titleTextStyle: {
						color: 'white'
				},
				hAxis: {
					title: 'Age',
					titleTextStyle: {
						color: 'white'
					}, 
					minValue: 0, 
					maxValue: 15,
					textStyle: {
						color: 'white'
					}
				},
				vAxis: {
					title: 'Weight',
					titleTextStyle: {
						color: 'white'
					}, 
					minValue: 0, 
					maxValue: 15,
					textStyle: {
						color: 'white'
					}
				},
				legend: 'none',
				backgroundColor: {
					fill: 'transparent',
				},
				chartArea: {
					backgroundColor: {
						fill:'black',
					},
					dataOpacity: 1
				},
			},
			data:[
				['Age', 'Weight'],
            	[8,12],
            	[4,5.5],
            	[11,14],
            	[4,5],
            	[3,3.5],
            	[6.5,7]
            ]
        };
	}

	render() {
		return (
			<div id="charts">
			<Chart
        		chartType="Histogram"
        		data={this.state.data}
		        options={this.state.options}
		        graph_id="1"
		        width="100%"
		        height="50%"
		        legend_toggle
		    />
		    <Chart
        		chartType="ScatterChart"
        		data={this.state.data}
		        options={this.state.options}
		        graph_id="2"
		        width="100%"
		        height="50%"
		        legend_toggle
		    />
			</div>
		);
	}
}