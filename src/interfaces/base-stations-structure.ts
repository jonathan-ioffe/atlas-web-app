export interface BaseStationStructure {
  id: number
  name: string
  x: number | string
  y: number | string
  z: number | string
}

export interface BaseStationInfo {
  snr: number
  detectionTime: number
}

export type BaseStationToTags = {
  [basestation: number]: { searchingTags: number[] }
}

export interface BaseStationToInterruptions {
  name: string
  data: number[]
}
