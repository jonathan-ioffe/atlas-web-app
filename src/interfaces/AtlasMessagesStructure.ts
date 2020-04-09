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