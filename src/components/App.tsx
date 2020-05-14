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
import { UserAuthenticationRequest } from '../interfaces/atlas-message-structure'
import { Feature } from 'ol'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import '../styles/carousel-override.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import { BaseStationToTags } from '../interfaces/base-stations-structure'
import { LoginView } from './login-view'
import { LoadingView } from './loading-view'
import { determineIsLoginResponse } from '../helpers/google-api'
import { getUserAuthFromCookies, setUserAuthToCookie } from '../helpers/cookies'
import { TagToDetections, TagToLocations } from '../interfaces/tags-structure'
import { MainPage } from './main-page'
import { GraphPage } from './graph-page'

export enum AvailablePages {
  main, graph
}

export interface AppState {
  isLoggedIn: boolean
  isLoading: boolean
  isMainPage: boolean
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
      isMainPage: true,
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
  componentUpdatePending = false
  

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
    return seconds >= 1 || isLoading || this.componentUpdatePending
  }
  componentDidUpdate() {
    this.componentUpdatePending = false
    this.lastUpdateDate = new Date()
  }

  setStateByKey = (key: keyof AppState, value: any) => {
    this.setState({ [key]: value } as Pick<AppState, keyof AppState>)
  }

  getStateByKey = (key: keyof AppState) => {
    return this.state[key]
  }

  setPageView = (page: AvailablePages) => {
    this.setState({
      isMainPage: page === AvailablePages.main,
    }, () => this.componentUpdatePending = true)
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

  render() {
    const { isLoggedIn, isLoading, isMainPage } = this.state

    // Dummy data for POC, once the API available, should get it from the server
    const timestamps = ['2020-04-20 11:00', '2020-04-20 11:10', '2020-04-20 11:20']
    const series = [
      {
        name: 'Base Station #1',
        data: [30, 20, 20],
      },
      {
        name: 'Base Station #2',
        data: [90, 100, 10],
      },
    ]

    return (
      <div>
        <Navbar setPageView={this.setPageView} />
        {isLoading ? (
          <LoadingView />
        ) : isLoggedIn ? (  
          isMainPage ?
          <MainPage {...this.state} />
          : <GraphPage
              timestamps={timestamps}
              baseStationToInterruptions={series}
           />
        ) : (
          <LoginView
            loginSuccessCallback={this.responseGoogle}
            loginFailureCallback={this.responseGoogle}
          />
        )}
      </div>
    )
  }
}

export default withCookies(App)
