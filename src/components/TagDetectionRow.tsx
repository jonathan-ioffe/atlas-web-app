import React, { FunctionComponent, useEffect } from 'react'
import { BaseStationInfo } from '../interfaces/BaseStationsStructure'
import $ from 'jquery'

export interface TagRowInfo {
  baseStationNum: number
  lastDetection: number
  baseStationInfo: BaseStationInfo
}

export interface TagDetectionRowProps {
  tagId: Number
  tagRowInfo: TagRowInfo[]
}

const getElapsedTime = (epochTimestamp: number) => {
  return Number((Date.now() / 1000 - epochTimestamp).toFixed(0))
}

const compareTagsByLastDetection = (item1: TagRowInfo, item2: TagRowInfo) => {
  if (item1.baseStationInfo.detectionTime < item2.baseStationInfo.detectionTime)
    return -1
  else if (
    item1.baseStationInfo.detectionTime > item2.baseStationInfo.detectionTime
  )
    return 1
  return 0
}

let TagDetectionRow: FunctionComponent<TagDetectionRowProps> = (
  props: TagDetectionRowProps,
) => {
  useEffect(() => {
    $('[data-toggle="tooltip"]').tooltip()
  }, [props])

  const { tagId, tagRowInfo } = props
  let lastDetectionTime = getElapsedTime(
    tagRowInfo[tagRowInfo.length - 1].lastDetection,
  )
  return (
    <tr>
      <td data-title='Tag ID'>{tagId}</td>
      <td data-title='Last Detection'>
        {lastDetectionTime <= 0 ? 0 : lastDetectionTime}s
      </td>
      <td>
        {tagRowInfo.sort(compareTagsByLastDetection).map((item: TagRowInfo) => (
          <span
            className='badge badge-pill badge-basestation mr-1'
            key={item.baseStationNum}
            data-toggle='tooltip'
            data-placement='top'
            title={`SNR: ${item.baseStationInfo.snr} | ${getElapsedTime(
              item.baseStationInfo.detectionTime,
            )}s ago`}
          >
            {item.baseStationNum}
          </span>
        ))}
      </td>
    </tr>
  )
}

export { TagDetectionRow }
