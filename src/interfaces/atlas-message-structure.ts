export interface SystemStructureMessage {
  basestationIds: number[]
  basestationNames: string[]
  basestationXs: (number | string)[]
  basestationYs: (number | string)[]
  basestationZs: (number | string)[]
  beaconIds: number[]
  beaconNames: string[]
  beaconXs: (number | string)[]
  beaconYs: (number | string)[]
  beaconZs: (number | string)[]
  center: number[]
}

export interface UserAuthenticationRequest {
  email: string
  googleTokenId: string | null
  signature: string | null
}

export interface UserAuthenticationResponse {
  email: string
  name: string
  signature: string | null
  verified: boolean
}

export interface LocalizationMessage {
  tagUid: number
  txUid: number
  time: number
  x: number
  y: number
  z: number
}

export interface DetectionMessage {
  basestation: number
  gain: number
  headroom: number
  rssi: number
  samplerate: number
  samples_clk: number
  snr: number
  tagUid: number
  time: number
  txUid: number
}

export interface TagSummaryMessage {
  basestation: number
  reportPeriod: number
  searchTime: number
  searchingDetection: number
  searchingNoDetection: number
  tagUid: number
  time: number
  trackingDetection: number
  trackingNoDetection: number
  trackingTooLate: number
}
