export interface IAppState {
    wsConnection: WebSocket | null,
    baseStationToInfo: any,
    detectedBaseStations: any[],
    tagToDetections: any
}