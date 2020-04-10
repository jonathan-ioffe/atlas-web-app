import { BaseStationStructure } from './../interfaces/BaseStationsStructure';
import { SystemStructureMessage, UserAuthenticationRequest, UserAuthenticationResponse } from './../interfaces/AtlasMessagesStructure';
import { AppState } from '../interfaces/AppState';
import { WebSocketConnection } from "./WebSocketConnection";
import { getCenterOfBaseStations, getFeaturesListOfBaseStations } from './MapUtils';
import { AtlasServerAddress, MessageClassName } from '../constants/AtlasConstants';


const LAST_UPDATED_KEY = "lastUpdated";

class AtlasConnection {
    private _connectionObject: WebSocketConnection
    private _setStateByKey: (key: keyof AppState, value: any) => void
    private _getStateByKey: (key: keyof AppState) => any
    private _setUserAuthCookie: (userAuth: UserAuthenticationRequest) => void

    onConnectionOpen = () => {
        let msg = JSON.stringify({
            class: MessageClassName.Connection,
            name: "transient",
            request: "WGS84"
        });
        this._connectionObject.sendMessage(msg);
    }

    receiveMessage = (evt: MessageEvent) => {
        // listen to data sent from the websocket server
        const msg = JSON.parse(evt.data);
        if (msg.class === MessageClassName.Localization) {
            // console.log(`Localization: ${JSON.stringify(msg)}`);
            // console.log(msg.x)
            // console.log(msg.y)
        }
        else if (msg.class === MessageClassName.Detection) {
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
                    if (element["baseStationNum"] === currBaseStationDoc["baseStationNum"]) {
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
        else if (msg.class === MessageClassName.SystemStructure) {
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
            this._setStateByKey("baseStationsFeatures", getFeaturesListOfBaseStations(baseStationsStructure));
            this._setStateByKey("baseStationsCenter", getCenterOfBaseStations(baseStationsStructure))
        }
        else if (msg.class === MessageClassName.UserAuthResponse) {
            const userAuthResponseMsg = msg as UserAuthenticationResponse;
            if (userAuthResponseMsg.verified) {
                this._setUserAuthCookie({
                    email: userAuthResponseMsg.email,
                    googleTokenId: null,
                    signature: userAuthResponseMsg.signature
                })
                this._setStateByKey("isLoggedIn", true);
            }
        }
        else if (msg.class !== MessageClassName.TagSummary && msg.class !== MessageClassName.GpsLocalization) {
            console.debug(`Received: ${JSON.stringify(msg)}`);
        }
    }

    authenticateUser(authRequest: UserAuthenticationRequest) {
        let msg = JSON.stringify({class: MessageClassName.UserAuthRequest, ...authRequest});
        this._connectionObject.sendMessage(msg);
    }

    constructor(setStateByKey: (key: keyof AppState, value: any) => void, getStateByKey: (key: keyof AppState) => any, setUserAuthCookie: (userAuth: UserAuthenticationRequest) => void) {
        this._connectionObject = new WebSocketConnection(AtlasServerAddress, this.onConnectionOpen, this.receiveMessage);
        this._setStateByKey = setStateByKey;
        this._getStateByKey = getStateByKey;
        this._setUserAuthCookie = setUserAuthCookie;
    }
}

export {AtlasConnection};