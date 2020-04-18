import React, { FunctionComponent, useEffect } from 'react'
import $ from 'jquery'
import { getElapsedTime } from '../../helpers/data-formatters'
import { BaseStationInfo } from '../../interfaces/base-stations-structure'
import { compareTagsByLastDetection } from '../../helpers/comparators'

export interface TagRowInfo {
  baseStationNum: number
  lastDetection: number
  baseStationInfo: BaseStationInfo
}

export interface TagDetectionRowProps {
  tagId: Number
  tagRowInfo: TagRowInfo[]
  lastLocalization?: number
}

export const TagDetectionRow: FunctionComponent<TagDetectionRowProps> = (
  props: TagDetectionRowProps,
) => {
  useEffect(() => {
    $('[data-toggle="tooltip"]').tooltip()
  }, [props])

  const { tagId, tagRowInfo, lastLocalization } = props
  const latestEntry = tagRowInfo[tagRowInfo.length - 1]
  const lastDetectionTime = getElapsedTime(latestEntry.lastDetection)
  const lastLocalizationTime = lastLocalization
    ? getElapsedTime(lastLocalization)
    : '--'
  return (
    <tr>
      <td>{tagId}</td>
      <td>{lastDetectionTime <= 0 ? 0 : lastDetectionTime}s</td>
      <td>
        {lastLocalizationTime <= 0 ? 0 : lastLocalizationTime}
        {typeof lastLocalizationTime === 'string' ? '' : 's'}
      </td>
      <td>
        {tagRowInfo.sort(compareTagsByLastDetection).map((item: TagRowInfo) => (
          <span
            className='badge badge-pill badge-basestation mr-1'
            key={item.baseStationNum}
            data-toggle='tooltip'
            data-placement='top'
            title={`BaseStation #${
              item.baseStationNum
            } | Tag: ${tagId} | SNR: ${
              item.baseStationInfo.snr
            } | ${getElapsedTime(item.baseStationInfo.detectionTime)}s ago`}
          >
            {item.baseStationNum}
          </span>
        ))}
      </td>
    </tr>
  )
}
