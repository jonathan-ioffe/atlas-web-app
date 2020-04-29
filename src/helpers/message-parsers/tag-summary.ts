import { TagSummaryMessage } from '../../interfaces/atlas-message-structure'
import { BaseStationToTags } from '../../components/tables/basestations-table'


export interface ParseTagSummaryMessageReturnType {
  baseStationToTags: BaseStationToTags
  tagsLookedForByBasestations: number[]
}

export const parseTagSummaryMessage = (
  detectionMsg: TagSummaryMessage,
  baseStationToTags: BaseStationToTags,
  tagsLookedForByBasestations: number[]
): ParseTagSummaryMessageReturnType => {
  const { basestation, tagUid } = detectionMsg
  if (!tagsLookedForByBasestations.includes(tagUid)) {
    tagsLookedForByBasestations.push(tagUid)
  }
  if (!Object.keys(baseStationToTags).includes(basestation.toString())) {
    baseStationToTags[basestation] = { searchingTags: [tagUid] }
  } else {
    if (!baseStationToTags[basestation].searchingTags.includes(tagUid)) {
      baseStationToTags[basestation].searchingTags.push(tagUid)
    }
  }

  return {
    baseStationToTags: baseStationToTags,
    tagsLookedForByBasestations: tagsLookedForByBasestations
  }
}
