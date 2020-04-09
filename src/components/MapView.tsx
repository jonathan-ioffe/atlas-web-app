import React, { Component, useEffect } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {Map, View} from 'ol';
import 'ol/ol.css';
import { IMapViewProps } from '../interfaces/IMapViewProps';

class MapView extends Component<IMapViewProps> {

    osmLayer = new TileLayer({source: new OSM()});
    featureLayer = new VectorLayer({
        source: new VectorSource({
            features: this.props.features
        }) 
    });


    mapDivId = `map-${Math.random()}`;
    map = new Map({
        target: 'map',
        layers: [
            this.osmLayer,
            this.featureLayer
        ],
        view: new View({
        projection: 'EPSG:4326',
        center: this.props.mapCenter,
        zoom: 12
        })
    });

    componentDidMount() {
        this.map.setTarget(this.mapDivId);
    }
    componentDidUpdate() {
        this.map.getView().setCenter(this.props.mapCenter);
    }
        
    render() {

        return (
            <div className="col-5 col-xs-3 ml-auto" style={{position: 'relative', height: '90vh'}} id={this.mapDivId}></div>
        );
    }
}

export {MapView};
