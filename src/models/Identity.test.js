import { Identity } from "./Identity";

it("can create a instance of a model", () => {
  const identity = Identity.create({
    name: "Get Scatter",
    state: "initial"
  });

  expect(identity.name).toBe("Get Scatter");
  expect(identity.isAuthenticated).toBeFalsy()

  identity.setSession({ name: "Bob" });
  expect(identity.name).toBe("Bob");
  expect(identity.isAuthenticated).toBeTruthy()

  identity.setSession(null);
  expect(identity.name).toBe("Get Scatter");
});
