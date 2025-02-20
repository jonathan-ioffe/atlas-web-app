import { TagRowInfo } from '../components/tables/detections-table/row'

export const compareStringsAsNumber = (a: string, b: string) => {
  if (Number(a) < Number(b)) {
    return -1
  }
  return 1
}

export const compareTagsByLastDetection = (
  item1: TagRowInfo,
  item2: TagRowInfo,
) => {
  if (item1.baseStationInfo.detectionTime < item2.baseStationInfo.detectionTime)
    return -1
  else if (
    item1.baseStationInfo.detectionTime > item2.baseStationInfo.detectionTime
  )
    return 1
  return 0
}

export const compareTagsByBasestationNumber = (
  item1: TagRowInfo,
  item2: TagRowInfo,
) => {
  if (item1.baseStationNum < item2.baseStationNum) return -1
  else if (item1.baseStationNum > item2.baseStationNum) return 1
  return 0
}
