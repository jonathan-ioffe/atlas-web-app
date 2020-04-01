import React, { Component } from 'react';
import '../styles/App.css';
import "../styles/bootstrap.min.css";
import "../styles/open-iconic-bootstrap.min.css";

import "popper.js";
import 'bootstrap';
import $ from 'jquery';
import { Navbar } from './Navbar';
import { BasestationsTable } from './BasestationsTable';


const ATLAS_SERVER_ADDRESS = `wss://atlas-server.cs.tau.ac.il:6789`;
const CONNECTION_MSG_CLASS_NAME = "tau.atlas.messages.ConsumerConnectionStateExtended";
const LOCALIZATION_MSG_CLASS_NAME = "tau.atlas.messages.LocalizationMessage";
const DETECTION_MSG_CLASS_NAME = "tau.atlas.messages.DetectionMessage";

const LAST_UPDATED_KEY = "lastUpdated";


class App extends Component {
  constructor() {
    super();
    this.state = {
      wsConnection: null,
      baseStationToInfo: {},
      detectedBaseStations: [],
      tagToDetections: {}
    }
  }

  timeout = 250; // Initial timeout duration as a class variable

  componentDidMount() {
    this.connect();
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  /**
   * @function connect
   * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
   * With the help of the following article: https://dev.to/finallynero/using-websockets-in-react-4fkp
   */
  connect = () => {
    const {baseStationToInfo, tagToDetections, detectedBaseStations} = this.state;
    let wsConnection = new WebSocket(ATLAS_SERVER_ADDRESS, "json");
    let that = this; // cache the this
    var connectInterval;

    // websocket onopen event listener
    wsConnection.onopen = () => {
      console.log('SUCCESS connecting WebSocket');
      let msg = JSON.stringify({
        class: CONNECTION_MSG_CLASS_NAME,
        name: "transient",
        request: "WGS84"
      });
      console.log(`Sending: ${msg}`);
      wsConnection.send(msg);
      this.setState({ wsConnection: wsConnection });

      that.timeout = 250; // reset timer to 250 on open of websocket connection 
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection
    };

    wsConnection.onmessage = evt => {
      // listen to data sent from the websocket server
      const msg = JSON.parse(evt.data);
      if (msg.class === LOCALIZATION_MSG_CLASS_NAME) {
        console.log(`Localization: ${JSON.stringify(msg)}`);
      }
      else if (msg.class === DETECTION_MSG_CLASS_NAME) {
        const {tagUid, basestation, time, snr, ...nonRelevantFields} = msg;
        let currBaseStation = Number(basestation);
        let currInfo = {snr: Number(snr).toFixed(2), detectionTime: time};

        // console.log(`Detection message for station ${currBaseStation}`)
        baseStationToInfo[currBaseStation] = nonRelevantFields;
        this.setState({baseStationToInfo: baseStationToInfo});
        
        if (!detectedBaseStations.includes(currBaseStation)) {
          detectedBaseStations.push(currBaseStation);
        }

        if (tagToDetections.hasOwnProperty(tagUid)) {
          tagToDetections[tagUid][currBaseStation] = currInfo;
          tagToDetections[tagUid][LAST_UPDATED_KEY] = time;
        }
        else {
          tagToDetections[tagUid] = {};
          tagToDetections[tagUid][currBaseStation] = currInfo;
          tagToDetections[tagUid][LAST_UPDATED_KEY] = time;
        }
        this.setState({detectedBaseStations: detectedBaseStations, tagToDetections: tagToDetections});
      }
      else {
        console.log(msg);
        
      }
      
    }

    // websocket onclose event listener
    wsConnection.onclose = e => {
      console.log(
        `Connection to ATLAS server closed. Reconnect will be attempted in ${Math.min(10000 / 1000, (that.timeout + that.timeout) / 1000)} seconds`,
        e.reason
      );

      that.timeout = that.timeout + that.timeout; //increment retry interval
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
    };

    // websocket onerror event listener
    wsConnection.onerror = err => {
      console.error(
          "Socket encountered error: ",
          err.message,
          "Closing socket"
      );

      wsConnection.close();
    };
  };


  render() {
    const {baseStationToInfo, detectedBaseStations, tagToDetections} = this.state;
    return (
      <>
      <Navbar />
      <div className="m-3">
        <BasestationsTable 
          baseStationToInfo={baseStationToInfo}
          detectedBaseStations={detectedBaseStations}
          tagToDetections={tagToDetections}
        />
      </div>
    </>
    );
  }
}

export {App};
