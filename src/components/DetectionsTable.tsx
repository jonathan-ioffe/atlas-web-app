import React from 'react';
import '../styles/no-more-tables.css';
// import { BaseStationRow } from './BasestationRow';
import { TagDetectionRow } from './TagDetectionRow';
import { DetectionsTableProps } from '../interfaces/DetectionsTableProps';

let  compareStringsAsNumber = (a: string, b: string) => {
    if (Number(a) < Number(b)) {
        return -1;
    }
    return 1;
}


let DetectionsTable = (props: DetectionsTableProps) => {
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
                  {/* {detectedBaseStations.sort(compareStringsAsNumber).map((baseStationNum: any) => (
                      <th scope="col" key={baseStationNum}>{baseStationNum}</th>
                  ))} */}
                <th scope="col">Detections</th>
              </tr>
            </thead>
            <tbody>
                {Object.keys(tagToDetections).sort(compareStringsAsNumber).map(tagId => (
                    <TagDetectionRow
                        key={tagId}
                        tagId={Number(tagId)} 
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

export {DetectionsTable};