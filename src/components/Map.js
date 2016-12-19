import React from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import Filter from './Filter';
import ExampleChart from './GoogleChart';
import mrtGeojson from 'json!../mrt.geojson';
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
			displayChart: false
		};

		this._mapNode = null;
		this.updateMap = this.updateMap.bind(this);
		this.onEachFeature = this.onEachFeature.bind(this);
		this.mrtPointToLayer = this.mrtPointToLayer.bind(this);
		this.filterFeatures = this.filterFeatures.bind(this);
		this.filterGeoJSONLayer = this.filterGeoJSONLayer.bind(this);
		this.youbikePointToLayer = this.youbikePointToLayer.bind(this);
		this.onMarkClick = this.onMarkClick.bind(this);
		this.onMapClick = this.onMapClick.bind(this);
	}
 
	componentDidMount() {
		console.log('componentDidMount');
		this.getData();

		if (!this.state.map){
			this.init(this._mapNode);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		console.log('componoentDidUpdate');

		if (this.state.mrtGeojson && this.state.map && !this.state.mrtGeojsonLayer) {
			this.addGeoJSONLayer(this.state.mrtGeojson);
			this.addGeoJSONLayer(this.state.youbikeGeojson);
		}

		if (this.state.mrtLinesFilter !== prevState.mrtLinesFilter) {
			this.filterGeoJSONLayer();
		}
	}

	componontWillUnmount() {
		console.log('componontWillUnmount');
		this.state.map.remove();
	}

	getData() {
		console.log('getData');
		this.setState({
			numStations: mrtGeojson.features.length,
			mrtGeojson: mrtGeojson,
			youbikeGeojson: youbikeGeojson
		});
	}

	updateMap(e) {
		console.log('updateMap');
		let mrtLine = e.target.value;

		if(mrtLine === "All lines") {
			mrtLine = "*";
		}

		this.setState({
			mrtLinesFilter: mrtLine
		});
	}

	addGeoJSONLayer(geojson) {
		console.log('addGeoJSONLayer');
		if(geojson.type === 'mrtStations'){
			const mrtGeojsonLayer = L.geoJSON(geojson, {
				onEachFeature: this.onEachFeature,
				pointToLayer: this.mrtPointToLayer,
				filter: this.filterFeatures
			});

			mrtGeojsonLayer.addTo(this.state.map);

			this.setState({ mrtGeojsonLayer});
		}else if(geojson.type === 'youbikeSites'){
			const youbikeGeojsonLayer = L.geoJSON(geojson, {
				pointToLayer: this.youbikePointToLayer
			});

			youbikeGeojsonLayer.addTo(this.state.map);

			this.setState({ youbikeGeojsonLayer });
		}
	}

	filterGeoJSONLayer() {
		console.log("filterGeoJSONLayer");
		this.state.mrtGeojsonLayer.clearLayers();
		this.state.mrtGeojsonLayer.addData(mrtGeojson);
		// this.zoomToFeature(this.state.geojsonLayer);
	}

	zoomToFeature(target) {

	}

	filterFeatures(feature, layer) {
		console.log("filterFeatures");
		const test = feature.properties.line.split('-').indexOf(this.state.mrtLinesFilter);
		if(this.state.mrtLinesFilter === '*' || test !== -1) {
			return true;
		}
	}

	mrtPointToLayer(feature, latlng) {
		var markerParams = {
			radius: 5,
			fillColor: 'orange',
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

			const popupContent = "<h3>${feature.properties.name}</h3><strong>MRT line:</strong>${feature.properties.line}";
			layer.bindPopup(popupContent);
			layer.on('click',this.onMarkClick);
		}
	}

	onMarkClick(e) {
		console.log(e.target.feature.properties.name);
		this.setState({displayChart: true});
	}

	onMapClick(e) {
		console.log("chart close");
		this.setState({displayChart: false});
	}

	init(id) {
		console.log('init');
		if(this.state.map) return;

		let map = L.map(id, config.params);
		L.control.zoom({ position: "bottomleft"}).addTo(map);
    	L.control.scale({ position: "bottomleft"}).addTo(map);

		const tileLayer = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(map);
		this.setState({map, tileLayer});
		map.on('click',this.onMapClick);

	}

	render() {
		console.log('render');

		const { mrtLinesFilter } = this.state;

		return (
			<div id="mapUI">
				{
					mrtLineNames.length &&
						<Filter lines={ mrtLineNames }
								curFilter={ mrtLinesFilter }
								filterLines={ this.updateMap } />
				}
				{
					this.state.displayChart &&
					<ReactCSSTransitionGroup 
						transitionName="slideInFromRightSide"
						transitionEnterTimeout={2000}
						transitionLeaveTimeout={300}>
						<div id="chartArea">
							<ExampleChart />
						</div>
					</ReactCSSTransitionGroup>
				}
				<div ref={(node) => this._mapNode = node} id="map" />
			</div>
		);
	}
}