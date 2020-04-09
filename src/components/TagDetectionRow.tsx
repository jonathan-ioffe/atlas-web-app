import React from 'react';
import { ITagDetectionRowProps } from '../interfaces/ITableRowProps';


let TagDetectionRow = (props: ITagDetectionRowProps) => {
    const {tagId, baseStationToInfo, baseStationsList} = props;
    let lastUpdateTime: Number = (Date.now()/1000) - baseStationToInfo[baseStationToInfo.length - 1].lastUpdated;
    lastUpdateTime = Number(lastUpdateTime.toFixed(0));
    return (
        <tr>
            <td data-title="Tag ID">{tagId}</td>
            <td data-title="Last Detection">{lastUpdateTime <= 0 ? 0 : lastUpdateTime}s</td>
            {/* {baseStationsList.map(baseStationNum => (
                <td 
                    data-toggle="tooltip" data-placement="top" title={`${baseStationToInfo[baseStationNum] ? (Date.now()/1000) - baseStationToInfo[baseStationNum]["detectionTime"]: ''}`}
                    data-title={baseStationNum} 
                    key={`${tagId}${baseStationNum}`}
                >{baseStationToInfo[baseStationNum] ? baseStationToInfo[baseStationNum].snr : " "}</td>
            ))} */}
            <td>
            {baseStationToInfo.map((item: any) => (
        
                `${item.baseStationNum} - ${item.lastUpdated} |`
            ))}
            {/* {baseStationsList.map(baseStationNum => (
                baseStationToInfo[baseStationNum] ? `${baseStationNum}-${baseStationToInfo[baseStationNum].snr}` : ""
            ))} */}
            </td>
        </tr>
    );
}


export {TagDetectionRow};