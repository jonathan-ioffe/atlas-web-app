import React, { Component } from 'react';
import '../styles/App.css';
import "../styles/bootstrap.min.css";
import "../styles/open-iconic-bootstrap.min.css";

import "popper.js";
import 'bootstrap';
import $ from 'jquery';
import { Navbar } from './Navbar';
import { DetectionsTable } from './DetectionsTable';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout } from 'react-google-login';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies, ReactCookieProps } from 'react-cookie';
import { AppState } from '../interfaces/AppState';
import { AtlasConnection } from '../helpers/AtlasConnection';
import { MapView } from './MapView';
import { UserAuthenticationRequest } from '../interfaces/AtlasMessagesStructure';
import { CookieName, GoogleApiClientId } from '../constants/AppConstants';
import { Feature } from 'ol';
import { featuresByTagsToLayer } from '../helpers/MapUtils';

const determineIsLoginResponse = (toBeDetermined: GoogleLoginResponse | GoogleLoginResponseOffline): toBeDetermined is GoogleLoginResponse => {
  if ((toBeDetermined as GoogleLoginResponse).profileObj){
    return true
  }
  return false;
}

class App extends Component<ReactCookieProps, AppState> {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props: ReactCookieProps) {
    super(props);
    this.state = {
      isLoggedIn: false,
      atlasConnection: undefined,
      baseStationsCenter: [0,0,0],
      baseStationsFeatures: [],
      tagsFeatures: [],
      tagToLocationFeatures: {},
      baseStationToInfo: {},
      detectedBaseStations: [],
      tagToDetections: {}
    }
  }

  lastUpdateDate = new Date();

  componentDidMount() {
    let atlasConnection = new AtlasConnection(this.setStateByKey, this.getStateByKey, this.setUserAuthToCookie, this.addTagFeature);
    this.setState({atlasConnection: atlasConnection}, () => {
      let storedCookie = this.getUserAuthFromCookies();
      if (storedCookie != null) {
        atlasConnection.authenticateUser(storedCookie);
      }
    });
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  shouldComponentUpdate() {   
    const now = new Date();  
    var seconds = (now.getTime() - this.lastUpdateDate.getTime()) / 1000;   
    return seconds >= 1;   
  }
  componentDidUpdate() {     
    this.lastUpdateDate = new Date();  
  }

  setStateByKey = (key: keyof AppState, value: any) => {
    this.setState({ [key]: value } as Pick<AppState, keyof AppState>);
  }

  getStateByKey = (key: keyof AppState) => {
    return this.state[key];
  }
  
  addTagFeature = (tagId: number, tagFeature: Feature) => {
    const {tagToLocationFeatures} = this.state;
    if (Object.keys(tagToLocationFeatures).includes(tagId.toString())) {
      tagToLocationFeatures[tagId].push(tagFeature);
    }
    else {
      tagToLocationFeatures[tagId] = [tagFeature];
    }
    // console.log(tagsFeatures.length)
    // tagsFeatures.push(tagFeature);
    this.setState({tagToLocationFeatures: tagToLocationFeatures});
  }

  getUserAuthFromCookies(): UserAuthenticationRequest | null {
    const {cookies} = this.props;
    if (cookies != null) {
      return cookies.get(CookieName);
    }
    return null;
  }

  setUserAuthToCookie = (userAuth: UserAuthenticationRequest) => {
    const {cookies} = this.props;
    if (cookies != null)
      cookies.set(CookieName, userAuth);
  }

  removeUserAuthFromCookie() {
    const {cookies} = this.props;
    if (cookies != null)
      cookies.remove(CookieName)
    window.location.reload();
  }

  responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if (determineIsLoginResponse(response)) {
      const {atlasConnection} = this.state;
      let email = response.profileObj.email;
      let tokenId = response.tokenId;
      atlasConnection?.authenticateUser({email: email, googleTokenId: tokenId, signature: null});
    }
    else {
      console.log("google login is offline");
    }
  }

  mainPage() {
    const {baseStationsCenter, baseStationsFeatures, tagToLocationFeatures, baseStationToInfo, detectedBaseStations, tagToDetections} = this.state;
    return (
      <>
      <GoogleLogout
        clientId={GoogleApiClientId}
        buttonText="Logout"
        onFailure={() => {console.log("wat")}}
        onLogoutSuccess={() => {this.removeUserAuthFromCookie()}}
      />
      <div className="row">
        <div className="col-6 col-xs-2 mr-auto">
          <DetectionsTable 
            baseStationToInfo={baseStationToInfo}
            detectedBaseStations={detectedBaseStations}
            tagToDetections={tagToDetections}
          />
        </div>
        <MapView
          mapCenter={baseStationsCenter}
          baseStationsFeatures={baseStationsFeatures}
          tagsFeatures={featuresByTagsToLayer(tagToLocationFeatures)}
        />
      </div>
      </>
    )
  }

  loginPage() {
    return (
      <GoogleLogin
        clientId={GoogleApiClientId}
        buttonText="Login"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
    )
  }

  render() {
    const {isLoggedIn} = this.state;
    return (
      <>
        <Navbar />
        {isLoggedIn ? this.mainPage() : this.loginPage() }
      </>
    );
  }
}

export default withCookies(App);
