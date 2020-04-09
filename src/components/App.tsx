import React, { Component } from 'react';
import '../styles/App.css';
import "../styles/bootstrap.min.css";
import "../styles/open-iconic-bootstrap.min.css";

import "popper.js";
import 'bootstrap';
import $ from 'jquery';
import { Navbar } from './Navbar';
import { DetectionsTable } from './DetectionsTable';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';


import {Fill, Stroke, Circle, Style, Text} from 'ol/style';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';


import { IAppState } from '../interfaces/IAppState';
import { AtlasConnection } from '../helpers/AtlasConnection';
import { MapView } from './MapView';
import { getCenterOfBaseStations } from '../helpers/MapUtils';


const WEB_APP_MSG_CLASS_NAME = "tau.atlas.messages.WebAppMessage";

let feature1 = new Feature({
  geometry: new Point([
    35.7489906,
    33.1072795
  ])
})

let feature2 = new Feature({
  geometry: new Point([
    34.7489906,
    33.1072795
  ])
})

let style1 = new Style({
  image: new Circle({
    radius: 6,
    fill: new Fill({
      color: '#C62148'
    })
  }),
  text: new Text({
    text: "Hello",
    scale: 1.3,
    fill: new Fill({
      color: '#000000'
    }),
    textBaseline: "bottom",
    offsetY: -10
  })
});
let style2 = new Style({
  image: new Circle({
    radius: 6,
    fill: new Fill({
      color: '#C62148'
    })
  }),
  text: new Text({
    text: "Hello2",
    scale: 1.3,
    fill: new Fill({
      color: '#000000'
    }),
    textBaseline: "bottom",
    offsetY: -10
  })
})

feature1.setStyle(style1)
feature2.setStyle(style2)


const determineIsLoginResponse = (toBeDetermined: GoogleLoginResponse | GoogleLoginResponseOffline): toBeDetermined is GoogleLoginResponse => {
  if ((toBeDetermined as GoogleLoginResponse).profileObj){
    return true
  }
  return false;
}

class App extends Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isLoggedIn: false,
      atlasConnection: undefined,
      baseStationsStructure: [],
      baseStationToInfo: {},
      detectedBaseStations: [],
      tagToDetections: {}
    }
  }

  lastUpdateDate = new Date();

  componentDidMount() {
    this.setState({atlasConnection: new AtlasConnection(this.setStateByKey, this.getStateByKey)});
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

  setStateByKey = (key: keyof IAppState, value: any) => {
    this.setState({ [key]: value } as Pick<IAppState, keyof IAppState>);
  }

  getStateByKey = (key: keyof IAppState) => {
    return this.state[key];
  }

  responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if (determineIsLoginResponse(response)) {
      let email = response.profileObj.email;
      let tokenId = response.tokenId;
      let msg = JSON.stringify({
        class: WEB_APP_MSG_CLASS_NAME,
        email: email,
        googleTokenId: tokenId
      });
      console.log(msg);
      // if (wsConnection != null) {
      //   console.log(`Sending: ${msg}`);
      //   wsConnection.send(msg)
      // }
      // else {
      //   console.log("websocket connection is down")
      // }
    }
    else {
      console.log("google login is offline");
    }
  }
  

  getBaseStationToInfo = () => {
    return this.state.baseStationToInfo;
  }

  setBaseStationToInfo = (baseStationToInfo: any) => {
    this.setState({ baseStationToInfo: baseStationToInfo});
  }

  render() {
    const {isLoggedIn, baseStationsStructure, baseStationToInfo, detectedBaseStations, tagToDetections} = this.state;
    if (true) {
      return (
        <>
        <Navbar />
          <div className="row">
            <div className="col-6 col-xs-2 mr-auto">
              <DetectionsTable 
                baseStationToInfo={baseStationToInfo}
                detectedBaseStations={detectedBaseStations}
                tagToDetections={tagToDetections}
              />
            </div>
            <MapView
              mapCenter={getCenterOfBaseStations(baseStationsStructure)}
              features={[feature1, feature2]}
            />
          </div>
      </>
      );
    }
    return (
      <GoogleLogin
        clientId="669450188066-hqkbeb2v858td9q8vpaa5oca2uilhg3s.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
    );
  }
}

export {App};
