import { BaseStationStructure } from './../interfaces/BaseStationsStructure';
import { SystemStructureMessage } from './../interfaces/AtlasMessagesStructure';
import { IAppState } from './../interfaces/IAppState';
import { WebSocketConnection } from "./WebSocketConnection";

const ATLAS_SERVER_ADDRESS = `wss://atlas-server.cs.tau.ac.il:6789`;
const CONNECTION_MSG_CLASS_NAME = "tau.atlas.messages.ConsumerConnectionStateExtended";
const LOCALIZATION_MSG_CLASS_NAME = "tau.atlas.messages.LocalizationMessage";
const DETECTION_MSG_CLASS_NAME = "tau.atlas.messages.DetectionMessage";
const TAG_SUMAMRY_MSG_CLASS_NAME = "tau.atlas.messages.TagSummaryMessage";
const SYSTEM_STRUCTURE_MSG_CLASS_NAME = "tau.atlas.messages.SystemStructureMessage"; // WGS82 base stations coordinates
const GPS_LOCALIZATION_MSG_CLASS_NAME = "tau.atlas.messages.GPSLocalizationMessage"; 
const LAST_UPDATED_KEY = "lastUpdated";

class AtlasConnection {
    private _connectionObject: WebSocketConnection
    private _setStateByKey: (key: keyof IAppState, value: any) => void
    private _getStateByKey: (key: keyof IAppState) => any

    onConnectionOpen = () => {
        let msg = JSON.stringify({
            class: CONNECTION_MSG_CLASS_NAME,
            name: "transient",
            request: "WGS84"
        });
        this._connectionObject.sendMessage(msg);
    }

    receiveMessage = (evt: MessageEvent) => {
        // listen to data sent from the websocket server
        const msg = JSON.parse(evt.data);
        if (msg.class === LOCALIZATION_MSG_CLASS_NAME) {
            // console.log(`Localization: ${JSON.stringify(msg)}`);
            // console.log(msg.x)
            // console.log(msg.y)
        }
        else if (msg.class === DETECTION_MSG_CLASS_NAME) {
            let baseStationToInfo = this._getStateByKey("baseStationToInfo");
            let detectedBaseStations = this._getStateByKey("detectedBaseStations");
            let tagToDetections = this._getStateByKey("tagToDetections");

            const {tagUid, basestation, time, snr, ...nonRelevantFields} = msg;
            let currBaseStation = Number(basestation);
            let currInfo = {snr: Number(snr).toFixed(2), detectionTime: time};

            // console.log(`Detection message for station ${currBaseStation}`)
            baseStationToInfo[currBaseStation] = nonRelevantFields;
            this._setStateByKey("baseStationToInfo", baseStationToInfo);
            
            if (!detectedBaseStations.includes(currBaseStation)) {
                detectedBaseStations.push(currBaseStation);
            }
            this._setStateByKey("detectedBaseStations", detectedBaseStations);

            let currBaseStationDoc = {
                "baseStationNum": currBaseStation,
                [LAST_UPDATED_KEY]: time,
                "baseStationInfo": currInfo
            }
            

            if (tagToDetections.hasOwnProperty(tagUid)) {
                let baseStationAlreadyExists = false;
                for (let i = 0; i < tagToDetections[tagUid].length; i++) {
                    const element = tagToDetections[tagUid][i];
                    if (element["baseStationNum"] == currBaseStationDoc["baseStationNum"]) {
                        tagToDetections[tagUid][i] = currBaseStationDoc;
                        baseStationAlreadyExists = true;
                        break;
                    }
                }
                if (!baseStationAlreadyExists) {
                    if (tagToDetections[tagUid].length >= 3) {
                        tagToDetections[tagUid].shift();
                    }
                    tagToDetections[tagUid].push(currBaseStationDoc);    
                }
            }
            else {
                tagToDetections[tagUid] = [];
                tagToDetections[tagUid].push(currBaseStationDoc);
            }
            this._setStateByKey("tagToDetections", tagToDetections);

        }
        else if (msg.class === SYSTEM_STRUCTURE_MSG_CLASS_NAME) {
            const systemStructureMsg = msg as SystemStructureMessage;
            let baseStationsStructure: BaseStationStructure[] = [];
            for (let i = 0; i < systemStructureMsg.basestationIds.length; i++) {

                const currBaseStationStructure: BaseStationStructure = {
                    id: systemStructureMsg.basestationIds[i],
                    name: systemStructureMsg.basestationNames[i],
                    x: systemStructureMsg.basestationXs[i],
                    y: systemStructureMsg.basestationYs[i],
                    z: systemStructureMsg.basestationZs[i]
                }

                baseStationsStructure.push(currBaseStationStructure);
            }
            this._setStateByKey("baseStationsStructure", baseStationsStructure);
        }
        else if (msg.class !== TAG_SUMAMRY_MSG_CLASS_NAME && msg.class !== GPS_LOCALIZATION_MSG_CLASS_NAME) {
            console.log(msg);
        }
    }

    constructor(setStateByKey: (key: keyof IAppState, value: any) => void, getStateByKey: (key: keyof IAppState) => any) {
        this._connectionObject = new WebSocketConnection(ATLAS_SERVER_ADDRESS, this.onConnectionOpen, this.receiveMessage);
        this._setStateByKey = setStateByKey;
        this._getStateByKey = getStateByKey;
    }
}

export {AtlasConnection};