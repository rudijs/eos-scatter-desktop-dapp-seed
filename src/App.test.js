import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { Provider } from "mobx-react";
import { Identity } from "./models/Identity";
import Auth from "./components/Auth";
import config from "./config";

// real mobx state tree
const identityStateTree = Identity.create({
  name: "Guest",
  state: "initial"
});

// mock ScatterJS
const scatter = {
  connect(appName) {
    return Promise.resolve(null);
  }
};

const auth = new Auth({ config, identityStateTree, scatter });

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider identityStateTree={identityStateTree} auth={auth}>
      <App auth={auth} />
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
