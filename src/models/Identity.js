import { types } from "mobx-state-tree";
import { Machine } from "xstate";

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

      self.currentState = toggleMachine.transition(self.currentState, "TOGGLE").value;
      console.log(201, self.currentState);
    }
  }));
