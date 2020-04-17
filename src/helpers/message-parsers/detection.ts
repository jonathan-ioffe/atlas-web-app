import { NumOfBasestationsPerTag } from '../../constants/app-constants';
import { TagToDetections } from '../../components/table/table'
import { DetectionMessage } from '../../interfaces/AtlasMessagesStructure'
import { BaseStationInfo } from '../../interfaces/base-stations-structure'
import { TagRowInfo } from '../../components/table/row';

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
    for (let i = 0; i < tagToDetections[tagUid].length; i++) {
      const element = tagToDetections[tagUid][i]
      if (element['baseStationNum'] === currBaseStationDoc['baseStationNum']) {
        tagToDetections[tagUid][i] = currBaseStationDoc
        baseStationAlreadyExists = true
        break
      }
    }
    if (!baseStationAlreadyExists) {
      if (tagToDetections[tagUid].length >= NumOfBasestationsPerTag) {
        tagToDetections[tagUid].shift()
      }
      tagToDetections[tagUid].push(currBaseStationDoc)
    }
  } else {
    tagToDetections[tagUid] = []
    tagToDetections[tagUid].push(currBaseStationDoc)
  }

  return tagToDetections
}
