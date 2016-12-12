import React from 'react';
import { render } from 'react-dom';
import LeafletMap from './components/Map';
import './styles.css';

export default class App extends React.Component {
	render(){
		return (
			<div id="map">
				<LeafletMap />
				
			</div>
		);
	}
}


render(<App />,document.getElementById("root"));
