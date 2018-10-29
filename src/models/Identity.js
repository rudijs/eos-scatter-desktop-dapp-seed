import { types } from "mobx-state-tree";
import { Machine } from "xstate";

// visualizer: https://musing-rosalind-2ce8e7.netlify.com/
const stateChart = {
  initial: "idle",
  states: {
    idle: {
      on: {
        LOADING: "loading"
      }
    },
    loading: {
      on: {
        SUCCESS: "active",
        INACTIVE: "inactive",
        REJECTED: [
          {
            target: "inactive.rejected"
            // target: "inactive"
          }
        ],
        ERROR: [
          {
            target: "inactive.noConnection"
            // target: "inactive"
          }
        ]
      }
    },
    inactive: {
      on: {
        LOADING: "loading"
      },
      states: {
        rejected: {
          data: {
            details: "Identity request rejected"
          }
        },
        noConnection: {
          data: {
            details: "Cannot connect to Scatter"
          }
        }
      }
    },
    active: {
      on: {
        FORGET_IDENTITY: "loading"
      }
    }
  }
};

export const identityMachine = Machine(stateChart);
// console.log(identityMachine.events);

// states
const Tstates = types.enumeration([
  "idle",
  "loading",
  "active",
  "inactive",
  "inactive.noConnection",
  "inactive.rejected"
]);

// nested states
// const TnestedStates = types.model({
// inactive: types.string
// });

export const Identity = types
  .model({
    name: types.string,
    // currentState: types.union(Tstates, TnestedStates),
    currentState: Tstates,
    currentStateDetails: types.optional(types.string, "")
  })
  .views(self => ({
    get isAuthenticated() {
      return self.name === "Get Scatter" ? false : true;
    }
  }))
  .actions(self => ({
    stateTransition(event) {
      const currentState = identityMachine.transition(self.currentState, event);
      // console.log(101, JSON.stringify(currentState));

      let currentStateValue = currentState.value;

      // convert object notation for hierarchical states to dotted string type
      // example:
      // from: { inactive: 'noConnection' }
      // to: 'inactive.noConnection'
      if (typeof currentStateValue === "object") {
        currentStateValue = Object.keys(currentStateValue).reduce(
          (acc, curr) => {
            return acc + curr + "." + currentStateValue[curr];
          },
          ""
        );
      }

      self.currentState = currentStateValue;

      // currentState details
      self.currentStateDetails = stateDetails(currentStateValue, currentState);
    },
    setSession(identity) {
      if (!identity) {
        self.name = "Get Scatter";
        return;
      }
      self.name = identity.name;
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

function stateDetails(stateValue, state) {
  const allData = Object.keys(state.data).reduce((acc, curr) => {
    if (state.data[curr]) {
      const key = curr.replace(/\(machine\)\./, "");
      acc[key] = state.data[curr]["details"];
    }
    return acc;
  }, {});
  return allData[stateValue] || "";
}
