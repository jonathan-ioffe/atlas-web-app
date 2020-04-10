export interface SystemStructureMessage {
    class: string,
    basestationIds: number[],
    basestationNames: string[],
    basestationXs: (number|string)[],
    basestationYs: (number|string)[],
    basestationZs: (number|string)[],
    beaconIds: number[],
    beaconNames: string[],
    beaconXs: (number|string)[],
    beaconYs: (number|string)[],
    beaconZs: (number|string)[]
}

export interface UserAuthenticationRequest {
    email: string,
    googleTokenId: string | null,
    signature: string | null
}

export interface UserAuthenticationResponse {
    class: string,
    email: string,
    name: string,
    signature: string | null,
    verified: boolean
}