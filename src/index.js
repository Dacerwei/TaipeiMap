import React from 'react';
import { render } from 'react-dom';

export default class App extends React.Component {
	render(){
		return (
			<div>
				<h1>webpack works!</h1>
			</div>
		);
	}
}


render(<App />,document.getElementById("root"));
