import { TagSummaryMessage } from '../../interfaces/atlas-message-structure'
import { BaseStationToTags } from '../../components/tables/basestations-table'

export const parseTagSummaryMessage = (
  detectionMsg: TagSummaryMessage,
  baseStationToTags: BaseStationToTags,
): BaseStationToTags => {
  const { basestation, tagUid } = detectionMsg
  if (!Object.keys(baseStationToTags).includes(basestation.toString())) {
    baseStationToTags[basestation] = { searchingTags: [tagUid] }
  } else {
    if (!baseStationToTags[basestation].searchingTags.includes(tagUid)) {
      baseStationToTags[basestation].searchingTags.push(tagUid)
    }
  }

  return baseStationToTags
}
