import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { Provider } from "mobx-react";
import { Identity, identityMachine } from "./models/Identity";
import Auth from "./components/Auth";
import config from "./config";

// real mobx state tree
const identityState = Identity.create({
  name: "Guest",
  currentState: identityMachine.initialState.value
});

// mock ScatterJS
const scatter = {
  connect(appName) {
    return Promise.resolve(null);
  }
};

const auth = new Auth({ config, identityState, scatter });

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider identityState={identityState} auth={auth}>
      <App auth={auth} />
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
