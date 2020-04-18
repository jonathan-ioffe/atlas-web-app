import React, { FunctionComponent } from 'react'
import { TagRowInfo, TagDetectionRow } from './row'
import { compareStringsAsNumber } from '../../helpers/comparators'
import './style.css'

export type TagToDetections = { [tagUid: number]: TagRowInfo[] }

export interface DetectionsTableProps {
  tagToDetections: TagToDetections
}

export const DetectionsTable: FunctionComponent<DetectionsTableProps> = (
  props: DetectionsTableProps,
) => {
  const { tagToDetections } = props
  return (
    <>
      {Object.keys(tagToDetections).length <= 0 ? (
        <p className='text-center'>No tags detected!</p>
      ) : (
        <table className='table-striped table-hover'>
          <thead>
            <tr>
              <th scope='col'>Tag ID</th>
              <th scope='col'>Last Detection</th>
              <th scope='col'>Detections</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(tagToDetections)
              .sort(compareStringsAsNumber)
              .map((tagId) => (
                <TagDetectionRow
                  key={tagId}
                  tagId={Number(tagId)}
                  tagRowInfo={tagToDetections[Number(tagId)]}
                />
              ))}
          </tbody>
        </table>
      )}
    </>
  )
}
