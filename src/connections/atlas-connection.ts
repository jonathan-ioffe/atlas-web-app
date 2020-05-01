import { parseLocalizationMessage } from './../helpers/message-parsers/localization'
import { TagSummaryMessage } from './../interfaces/atlas-message-structure'
import { parseSystemStructureMessage } from '../helpers/message-parsers/system-structure'
import { parseDetectionMessage } from '../helpers/message-parsers/detection'
import {
  SystemStructureMessage,
  UserAuthenticationRequest,
  UserAuthenticationResponse,
  LocalizationMessage,
  DetectionMessage,
} from '../interfaces/atlas-message-structure'
import { WebSocketConnection } from './web-socket-connection'
import {
  AtlasServerAddress,
  MessageClassName,
} from '../constants/atlas-constants'
import { AppState } from '../components/App'
import { parseTagSummaryMessage } from '../helpers/message-parsers/tag-summary'

export class AtlasConnection {
  private _connectionObject: WebSocketConnection
  private _setStateByKey: (key: keyof AppState, value: any) => void
  private _getStateByKey: (key: keyof AppState) => any
  private _setUserAuthCookie: (userAuth: UserAuthenticationRequest) => void

  onConnectionOpen = () => {
    let msg = JSON.stringify({
      class: MessageClassName.Connection,
      name: 'transient',
      request: 'WGS84',
    })
    this._connectionObject.sendMessage(msg)
  }

  receiveMessage = (evt: MessageEvent) => {
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
        this._setStateByKey('isLoading', false)
        break
      case MessageClassName.Localization: {
        const localizationMsg = msg as LocalizationMessage
        const { tagToDetections, tagToLocations } = parseLocalizationMessage(
          localizationMsg,
          this._getStateByKey('tagToDetections'),
          this._getStateByKey('tagToLocations'),
        )
        this._setStateByKey('tagToDetections', tagToDetections)
        this._setStateByKey('tagToLocations', tagToLocations)
        break
      }
      case MessageClassName.Detection: {
        const detectionMsg = msg as DetectionMessage
        const tagToDetections = parseDetectionMessage(
          detectionMsg,
          this._getStateByKey('tagToDetections'),
        )
        this._setStateByKey('tagToDetections', tagToDetections)
        break
      }
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
        const tagSummaryMsg = msg as TagSummaryMessage
        const {
          baseStationToTags,
          tagsLookedForByBasestations,
        } = parseTagSummaryMessage(
          tagSummaryMsg,
          this._getStateByKey('baseStationToTags'),
          this._getStateByKey('tagsLookedForByBasestations'),
        )
        this._setStateByKey('baseStationToTags', baseStationToTags)
        this._setStateByKey(
          'tagsLookedForByBasestations',
          tagsLookedForByBasestations,
        )
        break
      default:
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
  ) {
    this._connectionObject = new WebSocketConnection(
      AtlasServerAddress,
      this.onConnectionOpen,
      this.receiveMessage,
    )
    this._setStateByKey = setStateByKey
    this._getStateByKey = getStateByKey
    this._setUserAuthCookie = setUserAuthCookie
  }
}
