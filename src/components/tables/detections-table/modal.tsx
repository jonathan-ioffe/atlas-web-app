import React, { FunctionComponent } from 'react'
import { TagRowInfo } from './row'
import { getElapsedTime } from '../../../helpers/data-formatters'
import { compareTagsByBasestationNumber } from '../../../helpers/comparators'

export const TAG_MODAL_ID = 'tagModal'

export interface TagModalProps {
  tagId: Number
  tagRowInfo: TagRowInfo[]
}

export const TagModal: FunctionComponent<TagModalProps> = (props) => (
  <div
    className='modal fade'
    id={`${TAG_MODAL_ID}${props.tagId}`}
    tabIndex={-1}
    role='dialog'
    aria-labelledby='tagModalLabel'
    aria-hidden='true'
  >
    <div className='modal-dialog' role='document'>
      <div className='modal-content'>
        <div className='modal-header'>
          <h5 className='modal-title' id='tagModalLabel'>
            Tag #{props.tagId} Info
          </h5>
          <button
            type='button'
            className='close'
            data-dismiss='modal'
            aria-label='Close'
          >
            <span aria-hidden='true'>&times;</span>
          </button>
        </div>
        <div className='modal-body'>
          <table className='table'>
            <thead>
              <tr>
                <th scope='col'>Basestation #</th>
                <th scope='col'>SNR</th>
                <th scope='col'>⏱</th>
              </tr>
            </thead>
            <tbody>
              {props.tagRowInfo
                .sort(compareTagsByBasestationNumber)
                .map((element: TagRowInfo) => (
                  <tr key={`${props.tagId}${element.baseStationNum}`}>
                    <th scope='row'>{element.baseStationNum}</th>
                    <td>{element.baseStationInfo.snr}</td>
                    <td>{getElapsedTime(element.lastDetection)}s ago</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className='modal-footer'>
          <button
            type='button'
            className='btn btn-secondary'
            data-dismiss='modal'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)
