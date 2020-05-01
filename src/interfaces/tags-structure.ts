import { TagRowInfo } from '../components/tables/detections-table/row'
import { Coordinate } from 'ol/coordinate'

export type TagToDetections = {
  [tagUid: number]: { rowInfo: TagRowInfo[]; lastLocalization?: number }
}

export type TagToLocations = { [tagId: number]: Coordinate[] }
