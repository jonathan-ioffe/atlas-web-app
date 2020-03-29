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
    const {baseStationToInfo, detectedBaseStations, tagToDetections} = props;
    // return (
    //     <>
    //     {Object.keys(baseStationToInfo).length <= 0
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
    //             {Object.keys(baseStationToInfo).sort(compareStringsAsNumber).map(baseStationNum => (
    //                 <BasestationRow
    //                     key={`${baseStationNum}`}
    //                     baseStationNum={baseStationNum} 
    //                     baseStationInfo={baseStationToInfo[baseStationNum]}
    //                 />
    //             ))}
    //         </tbody>
    //     </table>
    //     }
    //     </>
    // );

    return (
        <>
        {Object.keys(baseStationToInfo).length <= 0
        ? <p className="text-center">No available base stations readings!</p>
        :
        <table className="table-striped table-hover">
        {/* <table className="table table-striped table-bordered table-hover"> */}
            <thead>
              <tr>
                <th scope="col">Tag ID</th>
                <th scope="col">Last Detection</th>
                  {detectedBaseStations.sort(compareStringsAsNumber).map(baseStationNum => (
                      <th scope="col" key={baseStationNum}>{baseStationNum}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
                {Object.keys(tagToDetections).sort(compareStringsAsNumber).map(tagId => (
                    <TagDetectionRow
                        key={tagId}
                        tagId={tagId} 
                        baseStationToInfo={tagToDetections[tagId]}
                        baseStationsList={detectedBaseStations}
                    />
                ))}
            </tbody>
        </table>
        }
        </>
    );
}

export {BasestationsTable};