import { parseSystemStructureMessage } from '../helpers/message-parsers/system-structure'
import { parseDetectionMessage } from '../helpers/message-parsers/detection'
import {
  SystemStructureMessage,
  UserAuthenticationRequest,
  UserAuthenticationResponse,
  LocalizationMessage,
  DetectionMessage,
} from '../interfaces/AtlasMessagesStructure'
import { WebSocketConnection } from './web-socket-connection'
import { getTagFeature } from '../helpers/map-utils'
import {
  AtlasServerAddress,
  MessageClassName,
} from '../constants/atlas-constants'
import { Feature } from 'ol'
import { AppState } from '../components/app'

export class AtlasConnection {
  private _connectionObject: WebSocketConnection
  private _setStateByKey: (key: keyof AppState, value: any) => void
  private _getStateByKey: (key: keyof AppState) => any
  private _setUserAuthCookie: (userAuth: UserAuthenticationRequest) => void
  private _addTagFeature: (tagId: number, tagFeature: Feature) => void

  onConnectionOpen = () => {
    let msg = JSON.stringify({
      class: MessageClassName.Connection,
      name: 'transient',
      request: 'WGS84',
    })
    this._connectionObject.sendMessage(msg)
  }

  receiveMessage = (evt: MessageEvent) => {
    // listen to data sent from the websocket server
    const msg = JSON.parse(evt.data)
    switch (msg.class) {
      case MessageClassName.UserAuthResponse:
        const userAuthResponseMsg = msg as UserAuthenticationResponse
        if (userAuthResponseMsg.verified) {
          this._setUserAuthCookie({
            email: userAuthResponseMsg.email,
            googleTokenId: null,
            signature: userAuthResponseMsg.signature,
          })
          this._setStateByKey('isLoggedIn', true)
        } else {
          console.log('Unverified login')
        }
        break
      case MessageClassName.Localization:
        const localizationMsg = msg as LocalizationMessage
        let currTagFeature = getTagFeature([
          localizationMsg.x,
          localizationMsg.y,
          localizationMsg.z,
        ])
        this._addTagFeature(localizationMsg.tagUid % 1e6, currTagFeature)
        break
      case MessageClassName.Detection:
        const detectionMsg = msg as DetectionMessage
        let tagToDetections = parseDetectionMessage(
          detectionMsg,
          this._getStateByKey('tagToDetections'),
        )
        this._setStateByKey('tagToDetections', tagToDetections)
        break
      case MessageClassName.SystemStructure:
        const systemStructureMsg = msg as SystemStructureMessage
        const {
          baseStationsFeatures,
          baseStationsCenter,
        } = parseSystemStructureMessage(systemStructureMsg)
        this._setStateByKey('baseStationsFeatures', baseStationsFeatures)
        this._setStateByKey('baseStationsCenter', baseStationsCenter)
        break
      case MessageClassName.TagSummary:
        break
      case MessageClassName.GpsLocalization:
        break
      default:
        console.debug(`Received: ${JSON.stringify(msg)}`)
        break
    }
  }

  authenticateUser(authRequest: UserAuthenticationRequest) {
    let msg = JSON.stringify({
      class: MessageClassName.UserAuthRequest,
      ...authRequest,
    })
    this._connectionObject.sendMessage(msg)
  }

  constructor(
    setStateByKey: (key: keyof AppState, value: any) => void,
    getStateByKey: (key: keyof AppState) => any,
    setUserAuthCookie: (userAuth: UserAuthenticationRequest) => void,
    addTagFeature: (tagId: number, tagFeature: Feature) => void,
  ) {
    this._connectionObject = new WebSocketConnection(
      AtlasServerAddress,
      this.onConnectionOpen,
      this.receiveMessage,
    )
    this._setStateByKey = setStateByKey
    this._getStateByKey = getStateByKey
    this._setUserAuthCookie = setUserAuthCookie
    this._addTagFeature = addTagFeature
  }
}
