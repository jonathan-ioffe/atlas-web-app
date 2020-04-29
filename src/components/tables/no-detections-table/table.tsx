import React, { FunctionComponent } from 'react'
import { TagNoDetectionRow } from './row'
import { compareStringsAsNumber } from '../../../helpers/comparators'
import '../style.css'
import { getAMinusBItems } from '../../../helpers/arrays'

export interface NoDetectionsTableProps {
  detectedTags: number[]
  tagsLookedForByBasestations: number[]
}

export const NoDetectionsTable: FunctionComponent<NoDetectionsTableProps> = (
  props: NoDetectionsTableProps,
) => {
  const { detectedTags, tagsLookedForByBasestations } = props
  const tagsNotDetected = getAMinusBItems(tagsLookedForByBasestations, detectedTags)

  return (
    <>
      {Object.keys(tagsNotDetected).length <= 0 ? (
        <p className='text-center'>All tags were detected!</p>
      ) : (
        <table className='table-striped table-hover mt-1'>
          <thead>
            <tr>
              <th scope='col'>Tag ID</th>
            </tr>
          </thead>
          <tbody>
            {tagsNotDetected
            .map((tagId) => (
              <TagNoDetectionRow
                key={tagId}
                tagId={Number(tagId)}
              />
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
