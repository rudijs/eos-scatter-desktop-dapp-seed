import { Identity } from "./Identity";

describe("Identity State Tree", () => {
  let identity;

  beforeEach(() => {
    identity = Identity.create({
      name: "Get Scatter",
      state: "initial"
    });
  })

  it("can create a instance of a model", () => {
    
    expect(identity.name).toBe("Get Scatter");
    expect(identity.isAuthenticated).toBeFalsy()
    
    identity.setSession({ name: "Bob" });
    expect(identity.name).toBe("Bob");
    expect(identity.isAuthenticated).toBeTruthy()
    
    identity.setSession(null);
    expect(identity.name).toBe("Get Scatter");
  });
  
  it("can store an object in volatile state", () => {
    expect(identity.scatter).toBeNull
    identity.setScatter({a: "b"})    
    expect(identity.scatter.a).toEqual("b")
  })
})