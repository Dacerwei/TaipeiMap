import React from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import Filter from './Filter';
import geojson from 'json!../mrt.geojson';

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
			geojsonLayer: null,
			geojson: null,
			mrtLinesFilter: '*',
			numStations: null
		};

		this._mapNode = null;
		this.updateMap = this.updateMap.bind(this);
		this.onEachFeature = this.onEachFeature.bind(this);
		this.pointToLayer = this.pointToLayer.bind(this);
		this.filterFeatures = this.filterFeatures.bind(this);
		this.filterGeoJSONLayer = this.filterGeoJSONLayer.bind(this);
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

		if (this.state.geojson && this.state.map && !this.state.geojsonLayer) {
			this.addGeoJSONLayer(this.state.geojson);
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
			numStations: geojson.features.length,
			geojson: geojson
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
		console.log(mrtLineNames);
		const geojsonLayer = L.geoJSON(geojson, {
			onEachFeature: this.onEachFeature,
			pointToLayer: this.pointToLayer,
			filter: this.filterFeatures
		});

		geojsonLayer.addTo(this.state.map);

		this.setState({ geojsonLayer});


	}

	filterGeoJSONLayer() {
		console.log("filterGeoJSONLayer");
		this.state.geojsonLayer.clearLayers();
		this.state.geojsonLayer.addData(geojson);
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

	pointToLayer(feature, latlng) {
		console.log("pointToLayer");
		var markerParams = {
			radius: 4,
			fillColor: 'orange',
			color: '#fff',
			weight: 1,
			opacity: 0.5,
			fillOpacity: 0.8
		};

		return L.circleMarker(latlng, markerParams);
	}

	onEachFeature(feature, layer) {
		console.log("onEachFeature");
		if(feature.properties && feature.properties.name && feature.properties.line) {
			if(mrtLineNames.length < 7) {

				feature.properties.line.split('-').forEach(function(line, index){
					if(mrtLineNames.indexOf(line) === -1) mrtLineNames.push(line);
				});

				if(this.state.geojson.features.indexOf(feature) === this.state.numStations - 1) {
					mrtLineNames.sort();
					mrtLineNames.unshift('All lines');
				}
			}

			const popupContent = "<h3>${feature.properties.name}</h3><strong>MRT line:</strong>${feature.properties.line}";
			layer.bindPopup(popupContent);
		}
	}

	init(id) {
		console.log('init');
		if(this.state.map) return;

		let map = L.map(id, config.params);
		L.control.zoom({ position: "bottomleft"}).addTo(map);
    	L.control.scale({ position: "bottomleft"}).addTo(map);

		const tileLayer = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(map);
		this.setState({map, tileLayer});

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
				<div ref={(node) => this._mapNode = node} id="map" />
			</div>
		);
	}
}