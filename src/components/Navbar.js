import React, { Component } from 'react';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <button className="navbar-brand btn btn-link">ATLAS Web App</button>
            </nav>
        );
    }
}

export default Navbar;