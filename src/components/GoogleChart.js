import { Chart } from 'react-google-charts';
import React from 'react';

export default class ExampleChart extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			options: {
				title: this.props.chartTitle,
				titleTextStyle: {
						color: 'white'
				},
				hAxis: {
					title: 'Time',
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
					title: 'Fraquency',
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
					fill: 'transparent'
				},
				chartArea: {
					backgroundColor: {
						fill:'black'
					},
					dataOpacity: 1
				},
				isStacked: true
			},
			data: this.props.chartData
        };
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(nextProps.chartTitle !== this.props.chartTitle ) {
			return true;
		}else{
			return false;
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ 
			options: {
				title: nextProps.chartTitle,
				titleTextStyle: {
						color: 'white'
				},
				hAxis: {
					title: 'Time',
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
					title: 'Fraquency',
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
					fill: 'transparent'
				},
				chartArea: {
					backgroundColor: {
						fill:'black'
					},
					dataOpacity: 1
				},
				isStacked: true
			},
			data: this.props.chartData
		});
	}


	render() {
		return (
			<div id="charts">
			<Chart
        		chartType="LineChart"
        		data={this.state.data}
		        options={ this.state.options }
		        graph_id="2"
		        width="100%"
		        height="50%"
		        legend_toggle
		    />
			<Chart
        		chartType="Histogram"
        		data={this.state.data}
		        options={ this.state.options }
		        graph_id="1"
		        width="100%"
		        height="50%"
		        legend_toggle
		    />
			</div>
		);
	}
}