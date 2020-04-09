import { BaseStationStructure } from './../interfaces/BaseStationsStructure';


const getCenterOfBaseStations = (baseStationsStructure: BaseStationStructure[]) => { 
    
    let sumX = 0;
    let sumY = 0;
    let sumZ = 0;
    let count = 0;
    for (let i = 0; i < baseStationsStructure.length; i++) {
        const currBaseStation = baseStationsStructure[i];
        if (currBaseStation.id === 16 || currBaseStation.id === 17){
            console.log(`Skipping station ${currBaseStation.name}`)
            continue;
        }
        if (typeof currBaseStation.x === "number")
            sumX += currBaseStation.x;
        if (typeof currBaseStation.y === "number")
            sumY += currBaseStation.y;
        if (typeof currBaseStation.z === "number")
            sumZ += currBaseStation.z;
        count++;
    }
    if (count === 0) {
        return [0,0,0];
    }
    return [sumX/count, sumY/count, sumZ/count];
} 
export {getCenterOfBaseStations};