import React, { FunctionComponent } from 'react'
import { TagDetectionRow } from './row'
import { compareStringsAsNumber } from '../../../helpers/comparators'
import '../style.css'
import { Table } from '../base-table/table'
import { TableHeader } from '../base-table/table-header'
import { TagToDetections } from '../../../interfaces/tags-structure'

const HEADERS = [
  'Tag ID',
  'Last Detected',
  'Last Localized',
  'Detections'
]

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
        <Table>
          <TableHeader headers={HEADERS} />
          <tbody>
            {Object.keys(tagToDetections)
              .sort(compareStringsAsNumber)
              .map((tagId) => (
                <TagDetectionRow
                  key={tagId}
                  tagId={Number(tagId)}
                  tagRowInfo={tagToDetections[Number(tagId)].rowInfo}
                  lastLocalization={
                    tagToDetections[Number(tagId)].lastLocalization
                  }
                />
              ))}
          </tbody>
        </Table>
      )}
    </>
  )
}
