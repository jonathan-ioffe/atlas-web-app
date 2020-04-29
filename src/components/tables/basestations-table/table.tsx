import React, { FunctionComponent } from 'react'
import '../style.css'
import { compareStringsAsNumber } from '../../../helpers/comparators'
import { BaseStationsTableRow } from './row'
import { getAMinusBItems } from '../../../helpers/arrays'

export type BaseStationToTags = { [basestation: number]: {searchingTags: number[]} }

export interface BaseStationsTableProps {
  basestationToTags: BaseStationToTags,
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
        <table className='table-striped table-hover mt-1'>
          <thead>
            <tr>
              <th scope='col'>Base Station #</th>
              <th scope='col'>Tags Not Looking For</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(basestationToTags)
              .sort(compareStringsAsNumber)
              .map((baseStationNum) => (
                <BaseStationsTableRow
                  key={baseStationNum}
                  baseStationNum={Number(baseStationNum)}
                  searchingTags={getAMinusBItems(tagsLookedForByBasestations, basestationToTags[Number(baseStationNum)].searchingTags)}
                />
              ))}
          </tbody>
        </table>
      )}
    </>
  )
}