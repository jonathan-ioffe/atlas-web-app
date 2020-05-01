import { LocalizationMessage } from "../../interfaces/atlas-message-structure"
import { TagToDetections, TagToLocations } from "../../interfaces/tags-structure"
import { NumOfLocalizationsPerTag } from "../../constants/app-constants"

export interface ParseLocalizationMessageReturnType {
  tagToDetections: TagToDetections,
  tagToLocations: TagToLocations
}

export const parseLocalizationMessage = (
  localizationMsg: LocalizationMessage,
  tagToDetections: TagToDetections,
  tagToLocations: TagToLocations
): ParseLocalizationMessageReturnType => {
  let { tagUid, time, x, y } = localizationMsg
  const tagLocation = [x, y]

  if (Object.keys(tagToDetections).includes(tagUid.toString())) {
    tagToDetections[tagUid].lastLocalization = time
  }

  tagUid = tagUid % 1e6
  if (Object.keys(tagToLocations).includes(tagUid.toString())) {
    if (tagToLocations[tagUid].length >= NumOfLocalizationsPerTag)
      tagToLocations[tagUid].shift()
    tagToLocations[tagUid].push(tagLocation)
  } else {
    tagToLocations[tagUid] = [tagLocation]
  }

  return {
    tagToDetections: tagToDetections,
    tagToLocations: tagToLocations
  }
}