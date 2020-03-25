import React, { Component } from 'react';
import { connectToWebSocket } from "../helpers/webSocket";
import '../styles/App.css';
import "../styles/bootstrap.min.css";
import "../styles/open-iconic-bootstrap.min.css";

import 'bootstrap';
import $ from 'jquery';
import Navbar from './Navbar';


const ATLAS_SERVER_ADDRESS = `wss://atlas-server.cs.tau.ac.il:6789`;


class App extends Component {
  constructor() {
    super();
    this.state = {
      wsConnection: new WebSocket(ATLAS_SERVER_ADDRESS, "json"),
      msgArray: []
    }
  }

  componentDidMount() {
    const {wsConnection} = this.state;
    connectToWebSocket(wsConnection);

    wsConnection.onmessage = evt => {
      // listen to data sent from the websocket server
      const message = JSON.parse(evt.data)
      this.setState({dataFromServer: message})
      console.log(message)
      }

      wsConnection.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss

      }
  }

  render() {
    return (
      <>
      <Navbar x="a" />
      <div>
        ssss
      </div>
    </>
    );
  }
}

export default App;
