import { BaseStationStructure } from './BaseStationsStructure';
import { AtlasConnection } from '../helpers/AtlasConnection';

export interface IAppState {
    isLoggedIn: boolean,
    atlasConnection?: AtlasConnection,
    baseStationsStructure: BaseStationStructure[],
    baseStationToInfo: any,
    detectedBaseStations: any[],
    tagToDetections: any
}