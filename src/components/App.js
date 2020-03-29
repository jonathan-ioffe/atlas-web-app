import React, { Component } from 'react';
import '../styles/App.css';
import "../styles/bootstrap.min.css";
import "../styles/open-iconic-bootstrap.min.css";

import "popper.js";
import 'bootstrap';
import $ from 'jquery';
import {Navbar} from './Navbar';
import { BasestationsTable } from './BasestationsTable';


const ATLAS_SERVER_ADDRESS = `wss://atlas-server.cs.tau.ac.il:6789`;
const CONNECTION_MSG_CLASS_NAME = "tau.atlas.messages.ConsumerConnectionState";
const LOCALIZATION_MSG_CLASS_NAME = "tau.atlas.messages.LocalizationMessage";
const DETECTION_MSG_CLASS_NAME = "tau.atlas.messages.DetectionMessage";

const LAST_UPDATED_KEY = "last_updated";


class App extends Component {
  constructor() {
    super();
    this.state = {
      ws_connection: null,
      base_station_to_info: {},
      detected_base_stations: [],
      tag_to_detections: {}
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
    const {base_station_to_info, tag_to_detections, detected_base_stations} = this.state;
    let ws_connection = new WebSocket(ATLAS_SERVER_ADDRESS, "json");
    let that = this; // cache the this
    var connectInterval;

    // websocket onopen event listener
    ws_connection.onopen = () => {
      console.log('SUCCESS connecting WebSocket');
      let msg = JSON.stringify({
        class: CONNECTION_MSG_CLASS_NAME,
        name: "transient",
      });
      console.log(`Sending: ${msg}`);
      ws_connection.send(msg);
      this.setState({ ws_connection: ws_connection });

      that.timeout = 250; // reset timer to 250 on open of websocket connection 
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection
    };

    ws_connection.onmessage = evt => {
      // listen to data sent from the websocket server
      const msg = JSON.parse(evt.data);
      if (msg.class === LOCALIZATION_MSG_CLASS_NAME) {
        console.log(`Localization: ${JSON.stringify(msg)}`);
      }
      else if (msg.class === DETECTION_MSG_CLASS_NAME) {
        const {tagUid, basestation, time, gain, ...non_relevant_fields} = msg;
        let curr_base_station = Number(basestation);
        let curr_info = {gain: gain, detection_time: time};

        // console.log(`Detection message for station ${curr_basestation}`)
        base_station_to_info[curr_base_station] = non_relevant_fields;
        this.setState({base_station_to_info: base_station_to_info});
        
        if (!detected_base_stations.includes(curr_base_station)) {
          detected_base_stations.push(curr_base_station);
        }

        if (tag_to_detections.hasOwnProperty(tagUid)) {
          tag_to_detections[tagUid][curr_base_station] = curr_info;
          tag_to_detections[tagUid][LAST_UPDATED_KEY] = time;
        }
        else {
          tag_to_detections[tagUid] = {};
          tag_to_detections[tagUid][curr_base_station] = curr_info;
          tag_to_detections[tagUid][LAST_UPDATED_KEY] = time;
        }
        this.setState({detected_base_stations: detected_base_stations, tag_to_detections: tag_to_detections});
      }
      
    }

    // websocket onclose event listener
    ws_connection.onclose = e => {
      console.log(
        `Connection to ATLAS server closed. Reconnect will be attempted in ${Math.min(10000 / 1000, (that.timeout + that.timeout) / 1000)} seconds`,
        e.reason
      );

      that.timeout = that.timeout + that.timeout; //increment retry interval
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
    };

    // websocket onerror event listener
    ws_connection.onerror = err => {
      console.error(
          "Socket encountered error: ",
          err.message,
          "Closing socket"
      );

      ws_connection.close();
    };
  };


  render() {
    const {base_station_to_info, detected_base_stations, tag_to_detections} = this.state;
    return (
      <>
      <Navbar />
      <div className="m-3">
        <BasestationsTable 
          base_station_to_info={base_station_to_info}
          detected_base_stations={detected_base_stations}
          tag_to_detections={tag_to_detections}
        />
      </div>
    </>
    );
  }
}

export {App};
