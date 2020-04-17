import React, { Component } from 'react'
import '../styles/bootstrap.min.css'
import 'popper.js'
import 'bootstrap'
import { Navbar } from './navbar'
import { DetectionsTable, TagToDetections } from './table'
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'
import { instanceOf } from 'prop-types'
import { withCookies, Cookies, ReactCookieProps } from 'react-cookie'
import { AtlasConnection } from '../connections/atlas-connection'
import { MapView } from './map-view'
import { UserAuthenticationRequest } from '../interfaces/atlas-message-structure'
import {
  CookieName,
  GoogleApiClientId,
  NumOfLocalizationsPerTag,
} from '../constants/app-constants'
import { Feature } from 'ol'
import { featuresByTagsToCombinedFeatureArray } from '../helpers/map-utils'
import { BrowserView, MobileView } from 'react-device-detect'

import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import '../styles/carousel-override.css'

const determineIsLoginResponse = (
  toBeDetermined: GoogleLoginResponse | GoogleLoginResponseOffline,
): toBeDetermined is GoogleLoginResponse => {
  if ((toBeDetermined as GoogleLoginResponse).profileObj) {
    return true
  }
  return false
}

export interface AppState {
  isLoggedIn: boolean
  atlasConnection?: AtlasConnection
  baseStationsFeatures: Feature[]
  tagsFeatures: Feature[]
  tagToLocationFeatures: { [tagId: number]: Feature[] }
  baseStationsCenter: number[]
  tagToDetections: TagToDetections
}

class App extends Component<ReactCookieProps, AppState> {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  }

  constructor(props: ReactCookieProps) {
    super(props)
    this.state = {
      isLoggedIn: false,
      atlasConnection: undefined,
      baseStationsCenter: [0, 0],
      baseStationsFeatures: [],
      tagsFeatures: [],
      tagToLocationFeatures: {},
      tagToDetections: {},
    }
  }

  lastUpdateDate = new Date()

  componentDidMount() {
    let atlasConnection = new AtlasConnection(
      this.setStateByKey,
      this.getStateByKey,
      this.setUserAuthToCookie,
      this.addTagFeature,
    )
    this.setState({ atlasConnection: atlasConnection }, () => {
      let storedCookie = this.getUserAuthFromCookies()
      if (storedCookie != null) {
        atlasConnection.authenticateUser(storedCookie)
      }
    })
  }

  shouldComponentUpdate() {
    const now = new Date()
    var seconds = (now.getTime() - this.lastUpdateDate.getTime()) / 1000
    return seconds >= 1
  }
  componentDidUpdate() {
    this.lastUpdateDate = new Date()
  }

  setStateByKey = (key: keyof AppState, value: any) => {
    this.setState({ [key]: value } as Pick<AppState, keyof AppState>)
  }

  getStateByKey = (key: keyof AppState) => {
    return this.state[key]
  }

  addTagFeature = (tagId: number, tagFeature: Feature) => {
    const { tagToLocationFeatures } = this.state
    if (Object.keys(tagToLocationFeatures).includes(tagId.toString())) {
      if (tagToLocationFeatures[tagId].length >= NumOfLocalizationsPerTag)
        tagToLocationFeatures[tagId].shift()
      tagToLocationFeatures[tagId].push(tagFeature)
    } else {
      tagToLocationFeatures[tagId] = [tagFeature]
    }

    this.setState({ tagToLocationFeatures: tagToLocationFeatures })
  }

  getUserAuthFromCookies(): UserAuthenticationRequest | null {
    const { cookies } = this.props
    if (cookies != null) {
      return cookies.get(CookieName)
    }
    return null
  }

  setUserAuthToCookie = (userAuth: UserAuthenticationRequest) => {
    const { cookies } = this.props
    if (cookies != null) cookies.set(CookieName, userAuth)
  }

  removeUserAuthFromCookie() {
    const { cookies } = this.props
    if (cookies != null) cookies.remove(CookieName)
    window.location.reload()
  }

  responseGoogle = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
  ) => {
    if (determineIsLoginResponse(response)) {
      const { atlasConnection } = this.state
      let email = response.profileObj.email
      let tokenId = response.tokenId
      atlasConnection?.authenticateUser({
        email: email,
        googleTokenId: tokenId,
        signature: null,
      })
    } else {
      console.log('google login is offline')
    }
  }

  mainPage() {
    const {
      baseStationsCenter,
      baseStationsFeatures,
      tagToLocationFeatures,
      tagToDetections,
    } = this.state
    return (
      <>
        <BrowserView>
          <div className='row'>
            <div className='col-3 mr-auto'>
              <DetectionsTable tagToDetections={tagToDetections} />
            </div>
            <MapView
              mapCenter={baseStationsCenter}
              baseStationsFeatures={baseStationsFeatures}
              tagsFeatures={featuresByTagsToCombinedFeatureArray(tagToLocationFeatures)}
            />
          </div>
        </BrowserView>
        <MobileView>
          <Carousel showStatus={false} showThumbs={false} dynamicHeight>
            <div>
              <DetectionsTable tagToDetections={tagToDetections} />
            </div>
            <div>
              <MapView
                mapCenter={baseStationsCenter}
                baseStationsFeatures={baseStationsFeatures}
                tagsFeatures={featuresByTagsToCombinedFeatureArray(tagToLocationFeatures)}
              />
            </div>
          </Carousel>
        </MobileView>
      </>
    )
  }

  loginPage() {
    return (
      <GoogleLogin
        clientId={GoogleApiClientId}
        buttonText='Login'
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
    )
  }

  render() {
    const { isLoggedIn } = this.state
    return (
      <>
        <Navbar />
        {isLoggedIn ? this.mainPage() : this.loginPage()}
      </>
    )
  }
}

export default withCookies(App)
