import { SystemStructureMessage } from '../../interfaces/AtlasMessagesStructure'
import { BaseStationStructure } from '../../interfaces/base-stations-structure'
import { getFeaturesListOfBaseStations } from '../map-utils'
import { Feature } from 'ol'

export interface ParseSystemStructureMessageReturnType {
  baseStationsFeatures: Feature[]
  baseStationsCenter: number[]
}

export const parseSystemStructureMessage = (
  systemStructureMsg: SystemStructureMessage,
): ParseSystemStructureMessageReturnType => {
  let baseStationsStructure: BaseStationStructure[] = []
  for (let i = 0; i < systemStructureMsg.basestationIds.length; i++) {
    const currBaseStationStructure: BaseStationStructure = {
      id: systemStructureMsg.basestationIds[i],
      name: systemStructureMsg.basestationNames[i],
      x: systemStructureMsg.basestationXs[i],
      y: systemStructureMsg.basestationYs[i],
      z: systemStructureMsg.basestationZs[i],
    }

    baseStationsStructure.push(currBaseStationStructure)
  }

  return {
    baseStationsFeatures: getFeaturesListOfBaseStations(baseStationsStructure),
    baseStationsCenter: systemStructureMsg.center,
  }
}
