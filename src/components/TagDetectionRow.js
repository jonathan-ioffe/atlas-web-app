import React from 'react';


let TagDetectionRow = (props) => {
    const {tagId, baseStationToInfo, baseStationsList} = props;
    let lastUpdateTime = (Date.now()/1000) - baseStationToInfo.lastUpdated;
    lastUpdateTime = lastUpdateTime.toFixed(0);
    return (
        <tr>
            <td data-title="Tag ID">{tagId}</td>
            <td data-title="Last Detection">{lastUpdateTime}s</td>
            {baseStationsList.map(baseStationNum => (
                <td 
                    data-toggle="tooltip" data-placement="top" title={`${baseStationToInfo[baseStationNum] ? (Date.now()/1000) - baseStationToInfo[baseStationNum]["detectionTime"]: ''}`}
                    data-title={baseStationNum} 
                    key={`${tagId}${baseStationNum}`}
                >{baseStationToInfo[baseStationNum] ? baseStationToInfo[baseStationNum].snr : " "}</td>
            ))}
        </tr>
    );
}


export {TagDetectionRow};