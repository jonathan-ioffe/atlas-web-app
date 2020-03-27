import React, { Component } from 'react';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            // omitted fixed-top className
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <button className="navbar-brand btn btn-link">ATLAS Web App</button>
            </nav>
        );
    }
}

export {Navbar};