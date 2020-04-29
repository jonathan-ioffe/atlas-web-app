import React, { FunctionComponent } from 'react'

export interface TagNoDetectionRowProps {
  tagId: number
}

export const TagNoDetectionRow: FunctionComponent<TagNoDetectionRowProps> = (
  props: TagNoDetectionRowProps,
) => {
  const { tagId } = props
  return (
    <tr>
      <td>{tagId}</td>
    </tr>
  )
}
