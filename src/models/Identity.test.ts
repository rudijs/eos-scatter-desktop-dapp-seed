import { Identity, IdentityInterface } from "./Identity";

describe("Identity State Tree", () => {
  let identity: IdentityInterface;

  beforeEach(() => {
    identity = Identity.create({
      name: "Get Scatter",
      currentState: "idle"
    });
  });

  it("can create a instance of a model", () => {
    expect(identity.isAuthenticated).toBeFalsy();
    expect(identity.name).toBe("Get Scatter");

    identity.setSession({ name: "Bob" });
    expect(identity.name).toBe("Bob");
    expect(identity.isAuthenticated).toBeTruthy();

    identity.setSession(null);
    expect(identity.name).toBe("Get Scatter");
  });

  it("can store an object in volatile state", () => {
    expect(identity.scatter).toBeNull;
    identity.setScatter({ a: "b" });
    expect(identity.scatter.a).toEqual("b");
  });

  it("transitions state on events", () => {
    expect(identity.currentState).toEqual("idle");
    identity.stateTransition("LOADING");
    expect(identity.currentState).toEqual("loading");
    identity.stateTransition("ERROR");
    expect(identity.currentState).toEqual("inactive.noConnection");
  });
});
