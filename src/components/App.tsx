import React, { Component } from 'react'
import '../styles/bootstrap.min.css'
import 'popper.js'
import 'bootstrap'
import { Navbar } from './navbar'
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'
import { instanceOf } from 'prop-types'
import { withCookies, Cookies, ReactCookieProps } from 'react-cookie'
import { AtlasConnection } from '../connections/atlas-connection'
import { MapView } from './map-view'
import { UserAuthenticationRequest } from '../interfaces/atlas-message-structure'
import { Feature } from 'ol'
import { locationsByTagsToCombinedFeatureArray } from '../helpers/map-utils'
import { BrowserView, MobileView } from 'react-device-detect'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import '../styles/carousel-override.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import { TablesNav } from './tables/tables-nav'
import { BaseStationToTags } from '../interfaces/base-stations-structure'
import { LoginView } from './login-view'
import { LoadingView } from './loading-view'
import { determineIsLoginResponse } from '../helpers/google-api'
import { getUserAuthFromCookies, setUserAuthToCookie } from '../helpers/cookies'
import { TagToDetections, TagToLocations } from '../interfaces/tags-structure'

export interface AppState {
  isLoggedIn: boolean
  isLoading: boolean
  atlasConnection?: AtlasConnection
  baseStationsFeatures: Feature[]
  tagsFeatures: Feature[]
  tagToLocations: TagToLocations
  baseStationsCenter: number[]
  tagToDetections: TagToDetections
  baseStationToTags: BaseStationToTags
  tagsLookedForByBasestations: number[]
}

class App extends Component<ReactCookieProps, AppState> {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  }

  constructor(props: ReactCookieProps) {
    super(props)
    this.state = {
      isLoggedIn: false,
      isLoading: true,
      atlasConnection: undefined,
      baseStationsCenter: [0, 0],
      baseStationsFeatures: [],
      tagsFeatures: [],
      tagToLocations: {},
      tagToDetections: {},
      baseStationToTags: {},
      tagsLookedForByBasestations: [],
    }
  }

  lastUpdateDate = new Date()

  componentDidMount() {
    const { cookies } = this.props
    const setCookiesAuth = (userAuth: UserAuthenticationRequest) => {
      setUserAuthToCookie(cookies, userAuth)
    }
    let atlasConnection = new AtlasConnection(
      this.setStateByKey,
      this.getStateByKey,
      setCookiesAuth,
    )
    this.setState({ atlasConnection: atlasConnection }, () => {
      let storedCookie = getUserAuthFromCookies(cookies)
      if (storedCookie != null) {
        atlasConnection.authenticateUser(storedCookie)
      } else {
        this.setState({ isLoading: false })
      }
    })
  }

  shouldComponentUpdate() {
    const { isLoading } = this.state
    const now = new Date()
    var seconds = (now.getTime() - this.lastUpdateDate.getTime()) / 1000
    return seconds >= 1 || isLoading
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

  responseGoogle = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
  ) => {
    if (determineIsLoginResponse(response)) {
      this.setState({ isLoading: true })
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
      tagToLocations,
      tagToDetections,
      baseStationToTags,
      tagsLookedForByBasestations,
    } = this.state
    return (
      <>
        <BrowserView>
          <div className='row'>
            <div className='col-4'>
              <TablesNav
                tagToDetections={tagToDetections}
                baseStationToTags={baseStationToTags}
                tagsLookedForByBasestations={tagsLookedForByBasestations}
              />
            </div>
            <MapView
              mapCenter={baseStationsCenter}
              baseStationsFeatures={baseStationsFeatures}
              tagsFeatures={locationsByTagsToCombinedFeatureArray(
                tagToLocations,
              )}
            />
          </div>
        </BrowserView>
        <MobileView>
          <Carousel showStatus={false} showThumbs={false} dynamicHeight>
            <div className='w-auto'>
              <TablesNav
                tagToDetections={tagToDetections}
                baseStationToTags={baseStationToTags}
                tagsLookedForByBasestations={tagsLookedForByBasestations}
              />
            </div>
            <div>
              <MapView
                mapCenter={baseStationsCenter}
                baseStationsFeatures={baseStationsFeatures}
                tagsFeatures={locationsByTagsToCombinedFeatureArray(
                  tagToLocations,
                )}
              />
            </div>
          </Carousel>
        </MobileView>
      </>
    )
  }

  render() {
    const { isLoggedIn, isLoading } = this.state
    return (
      <>
        <Navbar />
        {isLoading ? (
          <LoadingView />
        ) : isLoggedIn ? (
          this.mainPage()
        ) : (
          <LoginView
            loginSuccessCallback={this.responseGoogle}
            loginFailureCallback={this.responseGoogle}
          />
        )}
      </>
    )
  }
}

export default withCookies(App)
