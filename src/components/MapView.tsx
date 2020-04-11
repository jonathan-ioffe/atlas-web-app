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

    lastUpdateDate = new Date();
    mapDivId = `map-${Math.random()}`;
    tagsLayer: VectorLayer | null = null;

    componentDidMount() {
        const {map} = this.state;
        map.setTarget(this.mapDivId);
    }

    shouldComponentUpdate() {
        const {mapCenterDefined, featuresDefined} = this.state;
        const now = new Date();  
        var seconds = (now.getTime() - this.lastUpdateDate.getTime()) / 1000;   
        return !mapCenterDefined || !featuresDefined || seconds >= 10;
    }
    componentDidUpdate() {
        const {map, mapCenterDefined, featuresDefined} = this.state;
        const {mapCenter, baseStationsFeatures, tagsFeatures} = this.props;
        if (!mapCenterDefined) {
            map.getView().setCenter(mapCenter);
            this.setState({mapCenterDefined: true});
        }
        if (!featuresDefined) {
            map.addLayer(new VectorLayer({
                source: new VectorSource({
                    features: baseStationsFeatures
                }) 
            }));
            this.setState({featuresDefined: true})
        }
        const currTagsLayer = new VectorLayer({
            source: new VectorSource({
                features: tagsFeatures
            }) 
        })
        if (this.tagsLayer != null)
            map.removeLayer(this.tagsLayer);
        map.addLayer(currTagsLayer);
        this.tagsLayer = currTagsLayer;
    }
        
    render() {

        return (
            <div className="col-5 col-xs-3 ml-auto" style={{position: 'relative', height: '90vh'}} id={this.mapDivId}></div>
        );
    }
}

export {MapView};
