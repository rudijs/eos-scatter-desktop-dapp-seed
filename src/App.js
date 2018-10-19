import React, { Component } from "react";
import PropTypes from "prop-types";
import "./App.css";

import BlockchainInfo from './components/BlockchainInfo'
import Navbar from './components/Navbar'

class App extends Component {
  componentDidMount() {
    // When the app loads, make a call to Scatter and see if we have an identity authorized
    // If we do, the mobx state tree will be updated.
    this.props.auth.identity();
  }

  render() {
    return (
      <div>
        <Navbar />
        <BlockchainInfo />
      </div>
    );
  }
}

App.propTypes = {
  auth: PropTypes.object.isRequired
};

export default App;
