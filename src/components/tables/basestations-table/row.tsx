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
          {searchingTags.sort().map((tagUid) => (
            <React.Fragment>
              <small>{tagUid}</small>
            </React.Fragment>
          ))}
        </div>
      </td>
    </tr>
  )
}
