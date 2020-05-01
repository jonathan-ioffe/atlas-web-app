import React, { FunctionComponent } from 'react'
import '../style.css'
import { compareStringsAsNumber } from '../../../helpers/comparators'
import { BaseStationsTableRow } from './row'
import { getAMinusBItems } from '../../../helpers/arrays'
import { Table } from '../base-table/table'
import { TableHeader } from '../base-table/table-header'
import { BaseStationToTags } from '../../../interfaces/base-stations-structure'

const HEADERS = [
  'Base Station #',
  'Tags Not Looking For'
]

export interface BaseStationsTableProps {
  basestationToTags: BaseStationToTags
  tagsLookedForByBasestations: number[]
}

export const BaseStationsTable: FunctionComponent<BaseStationsTableProps> = (
  props: BaseStationsTableProps,
) => {
  const { basestationToTags, tagsLookedForByBasestations } = props

  return (
    <>
      {Object.keys(basestationToTags).length <= 0 ? (
        <p className='text-center'>No base stations detected!</p>
      ) : (
        <Table>
          <TableHeader headers={HEADERS} />
          <tbody>
            {Object.keys(basestationToTags)
              .sort(compareStringsAsNumber)
              .map((baseStationNum) => (
                <BaseStationsTableRow
                  key={baseStationNum}
                  baseStationNum={Number(baseStationNum)}
                  searchingTags={getAMinusBItems(
                    tagsLookedForByBasestations,
                    basestationToTags[Number(baseStationNum)].searchingTags,
                  )}
                />
              ))}
          </tbody>
        </Table>
      )}
    </>
  )
}
