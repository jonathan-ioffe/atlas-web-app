import React from 'react'
import '../styles/no-more-tables.css'
import { TagDetectionRow, TagRowInfo } from './TagDetectionRow'

let compareStringsAsNumber = (a: string, b: string) => {
  if (Number(a) < Number(b)) {
    return -1
  }
  return 1
}

export type TagToDetections = { [tagUid: number]: TagRowInfo[] }

export interface DetectionsTableProps {
  tagToDetections: TagToDetections
}

let DetectionsTable = (props: DetectionsTableProps) => {
  const { tagToDetections } = props
  return (
    <>
      {Object.keys(tagToDetections).length <= 0 ? (
        <p className='text-center'>No tags detected!</p>
      ) : (
        <table className='table-striped table-hover'>
          {/* <table className="table table-striped table-bordered table-hover"> */}
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

export { DetectionsTable }
