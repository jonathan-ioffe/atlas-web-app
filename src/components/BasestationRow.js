import React from 'react';


function BasestationRow(props) {
    const {basestation_num, basestation_info} = props;
    return (
        <tr>
        <th scope="row">{basestation_num}</th>
        <td>{basestation_info.gain}</td>
        <td>{basestation_info.headroom}</td>
        <td>{basestation_info.rssi}</td>
        <td>{basestation_info.samplerate}</td>
        <td>{basestation_info.samples_clk}</td>
        <td>{basestation_info.snr}</td>
        </tr>
    );
}


export {BasestationRow};