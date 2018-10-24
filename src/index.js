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

const identityState = Identity.create({
  name: "Get Scatter",
  state: "initial"
});

// Keep one persistent reference to the ScatterJS object through-out your application's lifecycle.
// The best practice is to keep a reference to ScatterJS within your state controller, like MobX, Redux etc.
// Here we'll use volatile state in mobx-state-tree in such a way that the .scatter computed property
// is not observable, no patch/diff, no getSnapshot
identityState.setScatter(ScatterJS.scatter)

const auth = new Auth({
  config,
  identityState,
  scatter: identityState.scatter
});

ReactDOM.render(
  <Provider auth={auth} identityState={identityState}>
    <App auth={auth} />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about ser}vice workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
