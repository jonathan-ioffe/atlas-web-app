import React from 'react';
import {BasestationRow} from './BasestationRow';


function BasestationsTable(props) {
    const {base_station_to_info} = props;
    return (
        <>
        {Object.keys(base_station_to_info).length <= 0
        ? <p className="text-center">No available machines under this domain!</p>
        :
        <table className="table table-striped table table-bordered table-hover mt-5">
            <thead>
              <tr>
              <th scope="col">Base Station #</th>
              <th scope="col">Gain</th>
              <th scope="col">Headroom</th>
              <th scope="col">RSSI</th>
              <th scope="col">Samplerate</th>
              <th scope="col">Samples Clock</th>
              <th scope="col">SNR</th>
              </tr>
            </thead>
            <tbody>
                {Object.keys(base_station_to_info).sort().map(basestation_num => (
                    <BasestationRow
                        key={`${basestation_num}`}
                        basestation_num={basestation_num} 
                        basestation_info={base_station_to_info[basestation_num]}
                    />
                ))}
            </tbody>
        </table>
        }
        </>
    );
}


export {BasestationsTable};