import Auth from "./Auth";
import config from "../config";

let mockSetSession;
let mockStateTransition;

describe("Auth", () => {
  beforeEach(() => {
    mockSetSession = jest.fn(() => true);
    mockStateTransition = jest.fn(() => true);
  });

  const identity = { name: "Bob", publicKey: "EOS*********" };

  describe("connect()", () => {
    it("should handle rejected scatter connect() and setSession(null)", async () => {
      const options = {
        config,
        identityState: {
          setSession: mockSetSession,
          stateTransition: mockStateTransition
        },
        scatter: {
          connect(appName) {
            return Promise.reject(false);
          }
        }
      };
      const auth = new Auth(options);
      const connected = await auth.connect();
      expect(connected.isError).toBeTruthy();
      expect(connected.code).toEqual(500);
      expect(connected.type).toEqual("connection_rejected");
      expect(mockSetSession.mock.calls.length).toBe(1);
      expect(mockSetSession).toBeCalledWith(null);
      expect(mockStateTransition.mock.calls.length).toBe(1);
      expect(mockStateTransition).toBeCalledWith("ERROR");
    });

    it("should return false when connected but not authenticated (identity is null) and setSession(null)", async () => {
      const options = {
        config,
        identityState: {
          setSession: mockSetSession
        },
        scatter: {
          connect(appName) {
            return Promise.resolve(true);
          }
        }
      };
      const auth = new Auth(options);
      const connected = await auth.connect();
      expect(connected.isError).toBeFalsy();
      expect(connected.code).toEqual(200);
      expect(connected.type).toEqual("connection_accepted");
      expect(mockSetSession.mock.calls.length).toBe(1);
      expect(mockSetSession).toBeCalledWith(null);
    });
  });

  describe("identity()", () => {
    it("should return the identity when connected to Scatter and already authenticated and setSession(identity)", async () => {
      const options = {
        config,
        identityState: {
          setSession: mockSetSession,
          stateTransition: mockStateTransition
        },
        scatter: {
          connect(appName) {
            return Promise.resolve(true);
          }
        }
      };
      const auth = new Auth(options);
      const id = await auth.identity();
      expect(id.type).toEqual("connection_accepted");
      expect(id.code).toEqual(200);
      expect(id.isError).toBeFalsy();
      expect(id.identity).toBeUndefined();
      expect(mockSetSession.mock.calls.length).toBe(1);
      expect(mockSetSession).toBeCalledWith(null);
    });

    it("should return the identity when connected to Scatter and already authenticated and setSession(identity)", async () => {
      const options = {
        config,
        identityState: {
          setSession: mockSetSession,
          stateTransition: mockStateTransition
        },
        scatter: {
          connect(appName) {
            return Promise.resolve(true);
          },
          identity: identity
        }
      };
      const auth = new Auth(options);
      const id = await auth.identity();
      expect(id.type).toEqual("connection_identity");
      expect(id.code).toEqual(200);
      expect(id.isError).toBeFalsy();
      expect(id.identity.name).toEqual(identity.name);
      expect(id.identity.publicKey).toEqual(identity.publicKey);
      expect(mockSetSession.mock.calls.length).toBe(1);
      expect(mockSetSession).toBeCalledWith(identity);
    });
  });

  describe("logout()", () => {
    it("should return connection_rejected ...", async () => {
      const options = {
        config,
        identityState: {
          setSession: mockSetSession,
          stateTransition: mockStateTransition
        },
        scatter: {
          connect(appName) {
            return Promise.resolve(false);
          }
        }
      };
      const auth = new Auth(options);
      const logout = await auth.logout();
      expect(logout.type).toEqual("connection_rejected");
      expect(logout.code).toEqual(500);
      expect(logout.isError).toBeTruthy();
      expect(logout.message).toEqual("Cannot connect");
      expect(mockSetSession.mock.calls.length).toBe(1);
      expect(mockSetSession).toBeCalledWith(null);
    });

    it("should logout with forgetIdentity() and setSession(null) when valid scatter.identity() is present", async () => {
      const mockForgetIdentity = jest.fn(() => true);

      const options = {
        config,
        identityState: {
          setSession: mockSetSession,
          stateTransition: mockStateTransition
        },
        scatter: {
          connect(appName) {
            return Promise.resolve(true);
          },
          forgetIdentity: mockForgetIdentity,
          identity: identity
        }
      };
      const auth = new Auth(options);
      const logout = await auth.logout();
      expect(logout.type).toEqual("connection_logged_out");
      expect(logout.code).toEqual(200);
      expect(logout.isError).toBeFalsy();
      expect(mockForgetIdentity.mock.calls.length).toBe(1);
      expect(mockSetSession.mock.calls.length).toBe(1);
      expect(mockSetSession).toBeCalledWith(null);
    });

    it("should logout setSession(null) and not forgetIdentity() when no valid scatter.identity() is present", async () => {
      const mockForgetIdentity = jest.fn(() => true);

      const options = {
        config,
        identityState: {
          setSession: mockSetSession,
          stateTransition: mockStateTransition
        },
        scatter: {
          connect(appName) {
            return Promise.resolve(true);
          },
          forgetIdentity: mockForgetIdentity
        }
      };
      const auth = new Auth(options);
      const logout = await auth.logout();
      expect(logout.type).toEqual("connection_logged_out");
      expect(logout.code).toEqual(200);
      expect(logout.isError).toBeFalsy();
      expect(mockSetSession.mock.calls.length).toBe(1);
      expect(mockSetSession).toBeCalledWith(null);
      expect(mockForgetIdentity.mock.calls.length).toBe(0);
    });
  });

  describe("login()", () => {
    it("should return connection_rejected and setSession(null)", async () => {
      const options = {
        config,
        identityState: {
          setSession: mockSetSession,
          stateTransition: mockStateTransition
        },
        scatter: {
          connect(appName) {
            return Promise.reject(false);
          }
        }
      };
      const auth = new Auth(options);
      const login = await auth.login();
      expect(login.type).toEqual("connection_rejected");
      expect(login.isError).toBeTruthy();
      expect(login.code).toEqual(500);
      expect(login.message).toEqual("Cannot connect");
      expect(mockSetSession.mock.calls.length).toBe(1);
      expect(mockSetSession).toBeCalledWith(null);
    });

    it("should return an existing identity and not scatter.getIdentity()", async () => {
      const mockGetIdentity = jest.fn(() => true);

      const options = {
        config,
        identityState: {
          setSession: mockSetSession,
          stateTransition: mockStateTransition
        },
        scatter: {
          connect(appName) {
            return Promise.resolve(true);
          },
          getIdentity: mockGetIdentity,
          identity: identity
        }
      };
      const auth = new Auth(options);
      const login = await auth.login();
      expect(login.identity.name).toEqual(identity.name);
      expect(login.identity.publicKey).toEqual(identity.publicKey);
      expect(mockGetIdentity.mock.calls.length).toBe(0);
      expect(mockSetSession.mock.calls.length).toBe(0);
    });

    it("should return an identity and call scatter.getIdentity() and call setSession(null) and setSession(identity)", async () => {
      const mockGetIdentity = jest.fn(() => Promise.resolve(identity));

      const options = {
        config,
        identityState: {
          setSession: mockSetSession,
          stateTransition: mockStateTransition
        },
        scatter: {
          connect(appName) {
            return Promise.resolve(true);
          },
          getIdentity: mockGetIdentity
        }
      };
      const auth = new Auth(options);
      const login = await auth.login();
      expect(login.identity.name).toEqual(identity.name);
      expect(login.identity.publicKey).toEqual(identity.publicKey);
      expect(mockGetIdentity.mock.calls.length).toBe(1);
      expect(mockSetSession.mock.calls.length).toBe(2);
      expect(mockSetSession).toHaveBeenNthCalledWith(1, null);
      expect(mockSetSession).toHaveBeenNthCalledWith(2, identity);
    });

    it("should handle user identity rejected and call setSession(null)", async () => {
      const identityRejected = {
        type: "identity_rejected",
        message: "User rejected the provision of an Identity",
        code: 402,
        isError: true
      };
      const mockGetIdentity = jest.fn(() => Promise.reject(identityRejected));

      const options = {
        config,
        identityState: {
          setSession: mockSetSession,
          stateTransition: mockStateTransition
        },
        scatter: {
          connect(appName) {
            return Promise.resolve(true);
          },
          getIdentity: mockGetIdentity
        }
      };
      const auth = new Auth(options);
      const login = await auth.login();
      expect(login.type).toEqual("identity_rejected");
      expect(login.code).toEqual(402);
      expect(login.isError).toBeTruthy();
      expect(mockSetSession.mock.calls.length).toBe(1);
      expect(mockSetSession).toBeCalledWith(null);
    });
  });
});
