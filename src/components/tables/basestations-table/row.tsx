import React, { FunctionComponent } from 'react'

export interface BaseStationsTableRowProps {
  baseStationNum: number
  searchingTags: number[]
}

export const BaseStationsTableRow: FunctionComponent<BaseStationsTableRowProps> = (
  props: BaseStationsTableRowProps,
) => {
  const { baseStationNum, searchingTags } = props

  return (
    <tr style={{ overflow: 'scroll', whiteSpace: 'nowrap' }}>
      <td>{baseStationNum}</td>
      <td>
        <div className='wrap'>
          {searchingTags.length > 0
            ? searchingTags
                .sort()
                .map((tagUid) => <small key={tagUid}>{tagUid}</small>)
            : '✔️'}
        </div>
      </td>
    </tr>
  )
}
