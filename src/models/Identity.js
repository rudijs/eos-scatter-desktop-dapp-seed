import { types } from "mobx-state-tree";
import { Machine } from "xstate";

// visualizer: https://musing-rosalind-2ce8e7.netlify.com/
const stateChart = {
  "initial": "idle",
  "states": {
    "idle": {
      "on": {
        "LOADING": "loading"
      }
    },
    "loading": {
      "on": {
        "SUCCESS": "active",
        "INACTIVE": "inactive",
        "REJECTED": [
          {
            "target": "inactive.rejected"
          }
        ],
        "ERROR": [
          {
            "target": "inactive.noConnection"
          }
        ]
      }
    },
    "inactive": {
      "on": {
        "LOADING": "loading"
      },
      "states": {
        "rejected": {
          "data": {
            "details": "Identity request rejected"
          }
        },
        "noConnection": {
          "data": {
            "details": "Cannot connect to Scatter"
          }
        }
      }
    },
    "active": {
      "on": {
        "FORGET_IDENTITY": "loading"
      }
    }
  }
}

const identityMachine = Machine(stateChart)

const toggleMachine = Machine({
  initial: "inactive",
  states: {
    inactive: { on: { TOGGLE: "active" } },
    active: { on: { TOGGLE: "inactive" } }
  }
});

export const Identity = types
  .model({
    name: types.string,
    state: types.enumeration(["initial", "loading", "loaded", "error"]),
    currentState: toggleMachine.initialState.value
  })
  .views(self => ({
    get isAuthenticated() {
      return self.name === "Get Scatter" ? false : true;
    }
  }))
  .actions(self => ({
    setState(state) {
      self.state = state;
    },
    setSession(identity) {
      console.log(105, self.currentState);

      if (!identity) {
        self.name = "Get Scatter";
        return;
      }
      self.name = identity.name;

      self.currentState = toggleMachine.transition(
        self.currentState,
        "TOGGLE"
      ).value;
      console.log(201, self.currentState);
    }
  }))
  .extend(self => {
    let scatter = null;

    return {
      views: {
        get scatter() {
          return scatter;
        }
      },
      actions: {
        setScatter(value) {
          scatter = value;
        }
      }
    };
  });
