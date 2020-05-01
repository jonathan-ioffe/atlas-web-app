import React, { FunctionComponent } from 'react'
import { TagNoDetectionRow } from './row'
import '../style.css'
import { getAMinusBItems } from '../../../helpers/arrays'
import { Table } from '../base-table/table'
import { TableHeader } from '../base-table/table-header'

const HEADERS = [
  'Tag ID'
]

export interface NoDetectionsTableProps {
  detectedTags: number[]
  tagsLookedForByBasestations: number[]
}

export const NoDetectionsTable: FunctionComponent<NoDetectionsTableProps> = (
  props: NoDetectionsTableProps,
) => {
  const { detectedTags, tagsLookedForByBasestations } = props
  const tagsNotDetected = getAMinusBItems(
    tagsLookedForByBasestations,
    detectedTags,
  )

  return (
    <>
      {Object.keys(tagsNotDetected).length <= 0 ? (
        <p className='text-center'>All tags were detected!</p>
      ) : (
        <Table>
          <TableHeader headers={HEADERS} />
          <tbody>
            {tagsNotDetected.map((tagId) => (
              <TagNoDetectionRow key={tagId} tagId={Number(tagId)} />
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}
