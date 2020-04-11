import { AtlasConnection } from '../helpers/AtlasConnection';
import { Feature } from 'ol';


export interface AppState {
    isLoggedIn: boolean,
    atlasConnection?: AtlasConnection,
    baseStationsFeatures: Feature[],
    tagsFeatures: Feature[],
    tagToLocationFeatures: {[tagId: number]: Feature[]},
    baseStationsCenter: number[],
    baseStationToInfo: any,
    detectedBaseStations: any[],
    tagToDetections: any
}