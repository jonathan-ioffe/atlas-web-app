import React from 'react';
import { BaseStationRowProps } from '../interfaces/TableRowProps';


let BaseStationRow = (props: BaseStationRowProps) => {
    const {baseStationNum, baseStationInfo} = props;
    return (
        <tr>
        <td data-title="Base Station #">{baseStationNum}</td>
        <td data-title="Gain">{baseStationInfo.gain}</td>
        <td data-title="Headroom">{baseStationInfo.headroom}</td>
        <td data-title="RSSI">{baseStationInfo.rssi}</td>
        <td data-title="Sample Rate">{baseStationInfo.samplerate}</td>
        <td data-title="Samples Clock">{baseStationInfo.samples_clk}</td>
        <td data-title="SNR">{baseStationInfo.snr}</td>
        </tr>
    );
}


export {BaseStationRow};