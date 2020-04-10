import { AtlasConnection } from '../helpers/AtlasConnection';
import { Feature } from 'ol';

export interface AppState {
    isLoggedIn: boolean,
    atlasConnection?: AtlasConnection,
    baseStationsFeatures: Feature[],
    baseStationsCenter: number[],
    baseStationToInfo: any,
    detectedBaseStations: any[],
    tagToDetections: any
}