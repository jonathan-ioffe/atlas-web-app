import React from 'react';


function BasestationRow(props) {
    const {basestation_num, basestation_info} = props;
    return (
        <tr>
        <td data-title="Base Station #">{basestation_num}</td>
        <td data-title="Gain">{basestation_info.gain}</td>
        <td data-title="Headroom">{basestation_info.headroom}</td>
        <td data-title="RSSI">{basestation_info.rssi}</td>
        <td data-title="Sample Rate">{basestation_info.samplerate}</td>
        <td data-title="Samples Clock">{basestation_info.samples_clk}</td>
        <td data-title="SNR">{basestation_info.snr}</td>
        </tr>
    );
}


export {BasestationRow};