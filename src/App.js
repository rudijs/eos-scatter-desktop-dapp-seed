import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from './history'
import PropTypes from "prop-types";
import "./App.css";

import "typeface-roboto";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./components/layout/theme";

import Navbar from "./components/layout/Navbar";
import Home from "./components/Home";
import About from "./components/About";


class App extends Component {
  componentDidMount() {
    // When the app loads, make a call to Scatter and see if we already have an identity authorized
    // If we do, globally available identityState will be updated.
    this.props.auth.identity();
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router history={history}>
          <React.Fragment>
            <CssBaseline />
            <div>
              <Navbar />
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/about" component={About} />
              </Switch>
            </div>
          </React.Fragment>
        </Router>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  auth: PropTypes.object.isRequired
};

export default App;
