import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Map } from 'ol';

export interface MapViewProps {
    mapCenter: Coordinate
    baseStationsFeatures: Feature[],
}

export interface MapViewState {
    map: Map,
    mapCenterDefined: boolean,
    featuresDefined: boolean
}