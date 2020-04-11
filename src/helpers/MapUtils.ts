import VectorLayer from 'ol/layer/Vector';
import { BaseStationStructure } from './../interfaces/BaseStationsStructure';
import { Fill, Circle, Style, Text, Stroke } from 'ol/style';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Coordinate } from 'ol/coordinate';
import VectorSource from 'ol/source/Vector';


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

const getTagFeature = (tagId: number, location: Coordinate): Feature => {
    const currFeature = new Feature({
        geometry: new Point(location),
    });
    // const currStyle = new Style({
    //     image: new Circle({
    //         radius: 3,
    //         fill: new Fill({
    //         color: '#000000'
    //         })
    //     }),
    //     text: new Text({
    //         text: tagId.toString(),
    //         scale: 1.2,
    //         fill: new Fill({
    //         color: '#FFFFFF'
    //         }),
    //         textBaseline: "bottom",
    //         offsetY: -10
    //     })
    // });
    // currFeature.setStyle(currStyle);
    return currFeature;
    // return new VectorLayer({
    //     source: new VectorSource({
    //         features: [currFeature]
    //     }) 
    // })
}

const featuresByTagsToLayer = (tagToLocationFeatures: {[tagId: number]: Feature[]}): Feature[] => {
    let features: Feature[] = [];
    Object.keys(tagToLocationFeatures).map((tagIdStr) => {
        const tagId = Number(tagIdStr);

        const baseStyle = new Style({
            image: new Circle({
                radius: 3,
                fill: new Fill({
                color: '#000000'
                })
            })
        });
        const latestStyle = baseStyle.clone()
        latestStyle.setText(new Text({
            text: tagId.toString(),
            scale: 1.2,
            fill: new Fill({
            color: '#FFFFFF'
            }),
            stroke: new Stroke({color: '#000000'}),
            textBaseline: "bottom",
            offsetY: -10
        }))

        for (let i = 0; i < tagToLocationFeatures[tagId].length - 1; i++) {
            const currFeature = tagToLocationFeatures[tagId][i];
            currFeature.setStyle(baseStyle);
            features.push(currFeature);
        }
        const latestFeature = tagToLocationFeatures[tagId][tagToLocationFeatures[tagId].length - 1];
        latestFeature.setStyle(latestStyle);
        features.push(latestFeature);
    });
    return features;
}

export {getCenterOfBaseStations, getFeaturesListOfBaseStations, getTagFeature, featuresByTagsToLayer};