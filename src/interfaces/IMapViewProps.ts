import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';

export interface IMapViewProps {
    mapCenter: Coordinate
    features: Feature[]
}