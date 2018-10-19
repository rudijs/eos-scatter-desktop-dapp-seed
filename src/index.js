import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { Provider } from "mobx-react";
import Auth from "./components/Auth";
import config from "./config";
import ScatterJS from "scatterjs-core";
import ScatterEOS from "scatterjs-plugin-eosjs2";
import { Identity } from "./models/Identity";
ScatterJS.plugins(new ScatterEOS());

const identityStateTree = Identity.create({
  name: "Get Scatter",
  state: "initial"
});

const auth = new Auth({
  config,
  identityStateTree,
  scatter: ScatterJS.scatter
});

ReactDOM.render(
  <Provider auth={auth} identityStateTree={identityStateTree}>
    <App auth={auth} />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about ser}vice workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
