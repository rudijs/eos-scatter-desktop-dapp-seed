import { types } from "mobx-state-tree";
import { Machine, StateValueMap } from "xstate";

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
      meta: {
        details: "Connecting to Scatter"
      },
      on: {
        SUCCESS: "active",
        INACTIVE: [{ target: "inactive.connected" }],
        REJECTED: [{ target: "inactive.rejected" }],
        ERROR: [{ target: "inactive.noConnection" }]
      }
    },
    inactive: {
      initial: "noConnection",
      on: {
        LOADING: "loading"
      },
      states: {
        rejected: {
          meta: {
            details: "Identity request rejected"
          }
        },
        noConnection: {
          meta: {
            details: "Cannot connect to Scatter"
          }
        },
        connected: {
          meta: {
            details: "Can connect to Scatter"
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
// enum StateValue {
//   Idle = "idle",
//   Loading = "loading",
//   Active = "active",
//   Inactive = "inactive",
//   InactiveNoConnection = "inactive.noConnection",
//   InactiveRejected = "inactive.rejected"
// }

// states
// const Tstates = types.enumeration<StateValue>([
//   StateValue.Idle,
//   StateValue.Loading,
//   StateValue.Active,
//   StateValue.Inactive,
//   StateValue.InactiveNoConnection,
//   StateValue.InactiveRejected
// ]);
const Tstates = types.enumeration<string>([
  "idle",
  "loading",
  "active",
  "inactive.connected",
  "inactive.noConnection",
  "inactive.rejected"
]);

// nested states
// const TnestedStates = types.model({
// inactive: types.string
// });

// interface for the test.ts file
export interface IdentityInterface {
  name: string;
  currentState: string;
  isAuthenticated: boolean;
  setSession(identity: any): void;
  scatter: null | any;
  setScatter(value: any): void;
  stateTransition(event: string): void;
}

// export const Identity = types
export const Identity: any = types
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
    stateTransition(event: string) {
      console.log(101, self.currentState, event);
      const currentState = identityMachine.transition(self.currentState, event);
      // console.log(101, JSON.stringify(currentState));
      self.currentState = convertObjectToString(currentState.value);
      // currentState details
      self.currentStateDetails = stateDetails(self.currentState, currentState);
    },
    setSession(identity: any) {
      if (!identity) {
        self.name = "Get Scatter";
        return;
      }
      self.name = identity.name;
    }
  }))
  .extend(self => {
    let scatter: any = null;

    return {
      views: {
        get scatter() {
          return scatter;
        }
      },
      actions: {
        setScatter(value: any) {
          scatter = value;
        }
      }
    };
  });

// convert object notation for hierarchical states to dotted string type
// example:
// from: { inactive: 'noConnection' }
// to: 'inactive.noConnection'
function convertObjectToString(currentStateValue: string | StateValueMap) {
  if (typeof currentStateValue === "string") return currentStateValue;

  return Object.keys(currentStateValue).reduce((acc, curr) => {
    return acc + curr + "." + currentStateValue[curr];
  }, "");
}

interface IStateDetails {
  [key: string]: string;
}

function stateDetails(stateValue: string, state: any) {
  const allData: IStateDetails = Object.keys(state.meta).reduce(
    (acc: IStateDetails, curr) => {
      if (state.meta[curr]) {
        const key = curr.replace(/\(machine\)\./, "");
        acc[key] = state.meta[curr]["details"];
      }
      return acc;
    },
    {}
  );
  return allData[stateValue] || "";
}
