import React from 'react';


let TagDetectionRow = (props) => {
    const {tag_id, base_station_to_info, base_stations_list} = props;
    let last_update_time = (Date.now()/1000) - base_station_to_info.last_updated;
    last_update_time = last_update_time.toFixed(0);
    return (
        <tr>
            <td data-title="Tag ID">{tag_id}</td>
            <td data-title="Last Detection">{last_update_time}s</td>
            {base_stations_list.map(basestation_num => (
                <td 
                    data-toggle="tooltip" data-placement="top" title={`${base_station_to_info[basestation_num] ? (Date.now()/1000) - base_station_to_info[basestation_num]["detection_time"]: ''}`}
                    data-title={basestation_num} 
                    key={`${tag_id}${basestation_num}`}
                >{base_station_to_info[basestation_num] ? base_station_to_info[basestation_num].gain : " "}</td>
            ))}
        </tr>
    );
}


export {TagDetectionRow};