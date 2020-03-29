import React from 'react';
import '../styles/no-more-tables.css';
import {BasestationRow} from './BasestationRow';
import { TagDetectionRow } from './TagDetectionRow';

let  compareStringsAsNumber = (a, b) => {
    if (Number(a) < Number(b)) {
        return -1;
    }
    return 1;
}


let BasestationsTable = (props) => {
    const {base_station_to_info, detected_base_stations, tag_to_detections} = props;
    // return (
    //     <>
    //     {Object.keys(base_station_to_info).length <= 0
    //     ? <p className="text-center">No available base stations readings!</p>
    //     :
    //     <table className="table-striped table-hover">
    //     {/* <table className="table table-striped table-bordered table-hover"> */}
    //         <thead>
    //           <tr>
    //           <th scope="col">Base Station #</th>
    //           <th scope="col">Gain</th>
    //           <th scope="col">Headroom</th>
    //           <th scope="col">RSSI</th>
    //           <th scope="col">Sample Rate</th>
    //           <th scope="col">Samples Clock</th>
    //           <th scope="col">SNR</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //             {Object.keys(base_station_to_info).sort(compareStringsAsNumber).map(basestation_num => (
    //                 <BasestationRow
    //                     key={`${basestation_num}`}
    //                     basestation_num={basestation_num} 
    //                     basestation_info={base_station_to_info[basestation_num]}
    //                 />
    //             ))}
    //         </tbody>
    //     </table>
    //     }
    //     </>
    // );

    return (
        <>
        {Object.keys(base_station_to_info).length <= 0
        ? <p className="text-center">No available base stations readings!</p>
        :
        <table className="table-striped table-hover">
        {/* <table className="table table-striped table-bordered table-hover"> */}
            <thead>
              <tr>
                <th scope="col">Tag ID</th>
                <th scope="col">Last Detection</th>
                  {detected_base_stations.sort(compareStringsAsNumber).map(basestation_num => (
                      <th scope="col" key={basestation_num}>{basestation_num}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
                {Object.keys(tag_to_detections).sort(compareStringsAsNumber).map(tag_id => (
                    <TagDetectionRow
                        key={tag_id}
                        tag_id={tag_id} 
                        base_station_to_info={tag_to_detections[tag_id]}
                        base_stations_list={detected_base_stations}
                    />
                ))}
            </tbody>
        </table>
        }
        </>
    );
}

export {BasestationsTable};