import React, { Component } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {Map, View} from 'ol';
import 'ol/ol.css';
import { MapViewProps, MapViewState } from '../interfaces/MapView';

class MapView extends Component<MapViewProps, MapViewState> {
    constructor(props: MapViewProps) {
        super(props);
        this.state = {
            mapCenterDefined: false,
            featuresDefined: false,
            map: new Map({
                target: 'map',
                layers: [
                    new TileLayer({source: new OSM()})
                ],
                view: new View({
                projection: 'EPSG:4326',
                zoom: 11.5
                })
            })
        }
    }


    mapDivId = `map-${Math.random()}`;

    componentDidMount() {
        const {map} = this.state;
        map.setTarget(this.mapDivId);
    }

    shouldComponentUpdate() {
        const {mapCenterDefined, featuresDefined} = this.state;

        return !mapCenterDefined || !featuresDefined;
    }
    componentDidUpdate() {
        const {map} = this.state;
        const {mapCenter, baseStationsFeatures} = this.props;
        this.setState({mapCenterDefined: true, featuresDefined: true})
        map.getView().setCenter(mapCenter);
        map.addLayer(new VectorLayer({
            source: new VectorSource({
                features: baseStationsFeatures
            }) 
        }));
    }
        
    render() {

        return (
            <div className="col-5 col-xs-3 ml-auto" style={{position: 'relative', height: '90vh'}} id={this.mapDivId}></div>
        );
    }
}

export {MapView};
