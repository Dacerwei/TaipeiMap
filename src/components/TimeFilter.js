import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const infoStyle = {
	'textAlign': 'center',
    'margin': '10px',
   	'color': 'white'
}

class TimeFilter extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			index: 0,
			date: null
		};

		this.sliderChange = this.sliderChange.bind(this);
	}

	componentDidMount() {
		this.setState({
			index: 0,
			date: this.props.dataSet[0][0]
		});
	}
	
	sliderChange(e) {
		this.setState({
			index: e,
			date: this.props.dataSet[e][0]
		});
		this.props.callback(e);
	}

	render() {
		return(
			<div id="wrapper-slider">
				<p className="infoArea" style={ infoStyle }>{ this.state.date }</p>
				<Slider min={0} max={ this.props.dataSet.length - 1 } onChange={ this.sliderChange } />
			</div>
		);
	}
}

export default TimeFilter;