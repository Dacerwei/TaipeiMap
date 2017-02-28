import React from 'react';
import L from 'leaflet';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import 'leaflet/dist/leaflet.css';
import Filter from './Filter';
import ExampleChart from './GoogleChart';
import mrtGeojson from 'json!../mrtData.geojson';
import youbikeGeojson from 'json!../youbike.geojson';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


let config = {};

let mrtLineNames = [];

config.params = {
	center: [25.0408578889, 121.567904444],
	zoomControl: false,
	zoom: 13,
	maxZoom: 19,
	minZoom: 11,
	scrollwheel: false,
	legends: true,
	infoControl: false,
	attributionControl: true
};

config.tileLayer = {
	uri: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
	params: {
		minZoom: 5,
    	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    	id: 'geojedi.ooj08o8c',
    	accessToken: 'pk.eyJ1IjoiZ2VvamVkaSIsImEiOiJjaWpvMDNwYnMwMHRidmFseDRhOGNrZjIwIn0.hkVHv9_Z-PpXfOLrKMlfCQ'
    }
};


export default class LeafletMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			map: null,
			tileLayer: null,
			mrtGeojsonLayer: null,
			mrtGeojson: null,
			youbikeGeojsonLayer: null,
			youbikeGeojson: null,
			mrtLinesFilter: '*',
			numStations: null,
			sliderValue:0,
			displayChart: false,
			displayYoubikeLayer: true,
			chartTitle: null,
			chartData: null
		};

		this._mapNode = null;
		this.updateMap = this.updateMap.bind(this);
		this.openYoubikeLayer = this.openYoubikeLayer.bind(this);
		this.onEachFeature = this.onEachFeature.bind(this);
		this.mrtPointToLayer = this.mrtPointToLayer.bind(this);
		this.filterFeatures = this.filterFeatures.bind(this);
		this.filterGeoJSONLayer = this.filterGeoJSONLayer.bind(this);
		this.youbikePointToLayer = this.youbikePointToLayer.bind(this);
		this.onMarkClick = this.onMarkClick.bind(this);
		this.onMapClick = this.onMapClick.bind(this);
		this.onSliderChange = this.onSliderChange.bind(this);
		this.getColor = this.getColor.bind(this);
	}
 
	componentDidMount() {

		this.getData();

		if (!this.state.map){
			this.init(this._mapNode);
		}
	}

	componentDidUpdate(prevProps, prevState) {

		if (this.state.mrtGeojson && this.state.map && !this.state.mrtGeojsonLayer) {
			this.addGeoJSONLayer(this.state.mrtGeojson);
			this.addGeoJSONLayer(this.state.youbikeGeojson);
		}

		if (this.state.mrtLinesFilter !== prevState.mrtLinesFilter) {
			this.filterGeoJSONLayer();
		}

		if(this.state.map && this.state.youbikeGeojsonLayer ) {
			if(this.state.displayYoubikeLayer) {
				this.state.youbikeGeojsonLayer.addTo(this.state.map);
			} else {
				this.state.map.removeLayer(this.state.youbikeGeojsonLayer);
			}
		}
		console.log('state sliderValue: '+this.state.sliderValue);
	}

	componontWillUnmount() {
		this.state.map.remove();
	}

	getData() {
		this.setState({
			numStations: mrtGeojson.features.length,
			mrtGeojson: mrtGeojson,
			youbikeGeojson: youbikeGeojson
		});
	}

	updateMap(e) {
		let mrtLine = e.target.value;

		if(mrtLine === "All lines") {
			mrtLine = "*";
		}

		this.setState({
			mrtLinesFilter: mrtLine
		});
	}

	openYoubikeLayer(e) {
		let isOpen = e.target.checked;

		if(isOpen === true){
			this.setState({
				displayYoubikeLayer: true
			})
		}else {
			this.setState({
				displayYoubikeLayer: false
			})
		}

	}

	addGeoJSONLayer(geojson) {

		if(geojson.type === 'mrtStations'){
			const mrtGeojsonLayer = L.geoJSON(geojson, {
				onEachFeature: this.onEachFeature,
				pointToLayer: this.mrtPointToLayer,
				filter: this.filterFeatures
			});

			mrtGeojsonLayer.addTo(this.state.map);

			this.setState({ mrtGeojsonLayer });

		}else if(geojson.type === 'youbikeSites'){
			const youbikeGeojsonLayer = L.geoJSON(geojson, {
				pointToLayer: this.youbikePointToLayer
			});

			youbikeGeojsonLayer.addTo(this.state.map);

			this.setState({ youbikeGeojsonLayer });
		}
	}

	filterGeoJSONLayer() {
		this.state.mrtGeojsonLayer.clearLayers();
		this.state.mrtGeojsonLayer.addData(mrtGeojson);
	}

	filterFeatures(feature, layer) {
		const test = feature.properties.line.split('-').indexOf(this.state.mrtLinesFilter);
		if(this.state.mrtLinesFilter === '*' || test !== -1) {
			return true;
		}
	}

	mrtPointToLayer(feature, latlng) {
		let ColorValue = feature.properties['data'][this.state.sliderValue][1];
		var markerParams = {
			radius: 5,
			fillColor: this.getColor(ColorValue),
			color: '#fff',
			weight: 1,
			opacity: 0.5,
			fillOpacity: 0.8
		};

		return L.circleMarker(latlng, markerParams);
	}

	youbikePointToLayer(feature, latlng) {
		var markerParams = {
			radius: 3,
			fillColor: 'darkred',
			color: '#fff',
			weight: 1,
			opacity: 0.5,
			fillOpacity: 0.8
		};

		return L.circleMarker(latlng, markerParams);
	}

	onEachFeature(feature, layer) {
		if(feature.properties && feature.properties.name && feature.properties.line) {
			if(mrtLineNames.length < 7) {

				feature.properties.line.split('-').forEach(function(line, index){
					if(mrtLineNames.indexOf(line) === -1) mrtLineNames.push(line);
				});

				if(this.state.mrtGeojson.features.indexOf(feature) === this.state.numStations - 1) {
					mrtLineNames.sort();
					mrtLineNames.unshift('All lines');
				}
			}

			const popupContent = "<h3>"+ feature.properties.name+"</h3><strong>MRT line:</strong> "+ feature.properties.line;
			layer.bindPopup(popupContent);
			layer.on('click',this.onMarkClick);
		}
	}

	onMarkClick(e) {

		let chartData = e.target.feature.properties.data;
		chartData = [['time', 'enter','leave']].concat(chartData);

		this.setState({
			displayChart: true,
			chartTitle: e.target.feature.properties.name,
			chartData: chartData
		});
	}

	onMapClick(e) {
		this.setState({displayChart: false});
	}

	onSliderChange(e) {
		console.log('event value: '+e);
		this.setState({sliderValue: e});
	}

	getColor(value) {
		if(value > 200) {
			return '#FF0000';
		}else if( value >= 50) {
			return '#E8B50C';
		}else if( value >= 0) {
			return '#00FF60';
		}else {
			return 'gray';
		}
	}

	init(id) {
		if(this.state.map) return;

		let map = L.map(id, config.params);
		L.control.zoom({ position: "bottomleft"}).addTo(map);
    	L.control.scale({ position: "bottomleft"}).addTo(map);

		const tileLayer = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(map);
		this.setState({map, tileLayer});
		map.on('click',this.onMapClick);

	}

	render() {

		const { mrtLinesFilter } = this.state;
		const { displayYoubikeLayer } = this.state;

		return (
			<div id="mapUI">
				{
					mrtLineNames.length &&
						<Filter lines={ mrtLineNames }
								openYoubikeLayer={ this.openYoubikeLayer }
								curFilter={ mrtLinesFilter }
								filterLines={ this.updateMap }
								/>
				}
				{
					this.state.displayChart &&
					<ReactCSSTransitionGroup 
						transitionName="slideInFromRightSide"
						transitionEnterTimeout={2000}
						transitionLeaveTimeout={300} >
						<div id="chartArea">
							<ExampleChart  chartTitle= { this.state.chartTitle } chartData={ this.state.chartData } />
						</div>
					</ReactCSSTransitionGroup>	
				}
				<div id="wrapper-slider">
					<Slider min={0} max={100} onChange={ this.onSliderChange } />
				</div>
				<div ref={(node) => this._mapNode = node} id="map" />
			</div>
		);
	}
}