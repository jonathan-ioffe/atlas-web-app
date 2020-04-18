import { NumOfBasestationsPerTag } from '../../constants/app-constants'
import { TagToDetections } from '../../components/table/table'
import { DetectionMessage } from '../../interfaces/atlas-message-structure'
import { BaseStationInfo } from '../../interfaces/base-stations-structure'
import { TagRowInfo } from '../../components/table/row'

export const parseDetectionMessage = (
  detectionMsg: DetectionMessage,
  tagToDetections: TagToDetections,
): TagToDetections => {
  const { tagUid, basestation, time, snr } = detectionMsg
  let currBaseStation = Number(basestation)
  let currInfo: BaseStationInfo = {
    snr: Number(Number(snr).toFixed(2)),
    detectionTime: time,
  }

  let currBaseStationDoc: TagRowInfo = {
    baseStationNum: currBaseStation,
    lastDetection: time,
    baseStationInfo: currInfo,
  }

  if (tagToDetections.hasOwnProperty(tagUid)) {
    let baseStationAlreadyExists = false
    for (let i = 0; i < tagToDetections[tagUid].rowInfo.length; i++) {
      const element = tagToDetections[tagUid].rowInfo[i]
      if (element['baseStationNum'] === currBaseStationDoc['baseStationNum']) {
        tagToDetections[tagUid].rowInfo[i] = currBaseStationDoc
        baseStationAlreadyExists = true
        break
      }
    }
    if (!baseStationAlreadyExists) {
      if (tagToDetections[tagUid].rowInfo.length >= NumOfBasestationsPerTag) {
        tagToDetections[tagUid].rowInfo.shift()
      }
      tagToDetections[tagUid].rowInfo.push(currBaseStationDoc)
    }
  } else {
    tagToDetections[tagUid] = { rowInfo: [] }
    tagToDetections[tagUid].rowInfo.push(currBaseStationDoc)
  }

  return tagToDetections
}
