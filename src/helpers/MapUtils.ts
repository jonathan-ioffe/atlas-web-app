import { BaseStationStructure } from './../interfaces/BaseStationsStructure';
import { Fill, Circle, Style, Text } from 'ol/style';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';


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

const getFeaturesListOfBaseStations = (baseStationsStructure: BaseStationStructure[]): Feature[] => {
    let features: Feature[] = [];
    for (let i = 0; i < baseStationsStructure.length; i++) {
        const currBaseStation = baseStationsStructure[i];
        let x = 999;
        let y = 999;
        let z = 999;
        if (typeof currBaseStation.x === "number")
            x = currBaseStation.x;
        if (typeof currBaseStation.y === "number")
            y = currBaseStation.y;
        if (typeof currBaseStation.z === "number")
            z = currBaseStation.z;
        if ([x,y,z].includes(999))
            continue;

        const currFeature = new Feature({
            geometry: new Point([x, y, z]),
        });
        const currStyle = new Style({
        image: new Circle({
            radius: 8,
            fill: new Fill({
            color: '#49ADDF'
            })
        }),
        text: new Text({
            text: currBaseStation.id.toString(),
            scale: 1.2,
            fill: new Fill({
            color: '#FFFFFF'
            }),
            textBaseline: "center",
            // offsetY: -10
        })
        })
        currFeature.setStyle(currStyle);
        features.push(currFeature)
    }
    return features;
}

export {getCenterOfBaseStations, getFeaturesListOfBaseStations};