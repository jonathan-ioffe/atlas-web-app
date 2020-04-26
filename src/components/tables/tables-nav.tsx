import React, { FunctionComponent } from 'react'
import { TagToDetections, DetectionsTable } from './detections-table'
import { BaseStationToTags, BaseStationsTable } from './basestations-table'

interface TablesNavProps {
  tagToDetections: TagToDetections
  baseStationToTags: BaseStationToTags
}

export const TablesNav: FunctionComponent<TablesNavProps> = (props) => {
  const { tagToDetections, baseStationToTags } = props
  return (
    <div className='m-1 table-wrapper-scroll-y custom-scrollbar'>
      <ul className='nav nav-pills' id='myTab' role='tablist'>
        <li className='nav-item'>
          <a
            className='nav-link active'
            id='pills-detections-tab'
            data-toggle='pill'
            href='#pills-detections'
            role='tab'
            aria-controls='pills-detections'
            aria-selected='true'
          >
            Detections
          </a>
        </li>
        <li className='nav-item'>
          <a
            className='nav-link'
            id='pills-basestations-tab'
            data-toggle='pill'
            href='#pills-basestations'
            role='tab'
            aria-controls='pills-basestations'
            aria-selected='false'
          >
            Basestations
          </a>
        </li>
      </ul>
      <div className='tab-content' id='pills-tabContent'>
        <div
          className='tab-pane fade show active'
          id='pills-detections'
          role='tabpanel'
          aria-labelledby='pills-detections-tab'
        >
          <DetectionsTable tagToDetections={tagToDetections} />
        </div>

        <div
          className='tab-pane fade'
          id='pills-basestations'
          role='tabpanel'
          aria-labelledby='pills-basestations-tab'
        >
          <BaseStationsTable basestationToTags={baseStationToTags} />
        </div>
      </div>
    </div>
  )
}
