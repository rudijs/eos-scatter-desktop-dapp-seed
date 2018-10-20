import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import "./App.css";

import "typeface-roboto";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./components/layout/theme";

import Navbar from "./components/layout/Navbar";
import Index from "./components/layout/Index";

class App extends Component {
  componentDidMount() {
    // When the app loads, make a call to Scatter and see if we have an identity authorized
    // If we do, the mobx state tree will be updated.
    this.props.auth.identity();
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <React.Fragment>
            <CssBaseline />
            <div>
              <Navbar />
              <Switch>
                <Route exact path="/" component={Index} />
                {/* <Route exact path="/lyrics/track/:id" component={Lyrics} /> */}
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
