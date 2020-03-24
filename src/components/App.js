import React, { Component } from 'react';

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
      wsConnection: new WebSocket(ATLAS_SERVER_ADDRESS, "json")
    }
  }

  componentDidMount() {
    const {wsConnection} = this.state;
    wsConnection.onopen = () => {
      console.log('connected');
      
    }
    wsConnection.onerror = (err) => {
      console.error(err);
      
    }
  }

  render() {
    return (
      <>
      <Navbar />
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </>
    );
  }
}

export default App;
