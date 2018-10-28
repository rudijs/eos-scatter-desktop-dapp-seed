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
            // target: "inactive.rejected"
            target: "inactive"
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

// states
const Tstates = types.enumeration(["idle", "loading", "active", "inactive"]);

// nested states
const TnestedStates = types.model({
  inactive: types.string
});

export const Identity = types
  .model({
    name: types.string,
    currentState: types.union(Tstates, TnestedStates)
  })
  .views(self => ({
    get isAuthenticated() {
      return self.name === "Get Scatter" ? false : true;
    }
  }))
  .actions(self => ({
    stateTransition(state) {
      self.currentState = identityMachine.transition(
        self.currentState,
        state
      ).value;
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
