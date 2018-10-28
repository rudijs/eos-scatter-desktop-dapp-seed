const Auth = class Auth {
  constructor(options) {
    // Always remember to null out the window.scatter reference
    // if you don't extensions will be able to catch that reference and make
    // requests to the user's Scatter on behalf of your domain, and you will have to take responsibility.
    window.scatter = null;

    this.config = options.config;
    this.identityState = options.identityState;
    this.scatter = options.scatter;
  }

  events = {
    LOADING: "LOADING",
    SUCCESS: "SUCCESS",
    FORGET_IDENTITY: "FORGET_IDENTITY",
    INACTIVE: "INACTIVE",
    REJECTED: "REJECTED",
    ERROR: "ERROR"
  };

  connect() {
    return this.scatter
      .connect(this.config.appName)
      .then(connected => {
        // If the user does not have Scatter or it is Locked or Closed
        // reset the application state
        if (!connected || !this.scatter.identity) {
          this.identityState.setSession(null);
        }

        // If the user does not have Scatter or it is Locked or Closed
        // tell the user we cannot connect to their wallet
        if (!connected) {
          return {
            type: "connection_rejected",
            code: 500,
            isError: true,
            message: "Cannot connect"
          };
        }

        // We can connect to Scatter but do not have an identity (not authenticated)
        // up the UI to a 'loading/authorizing' state (spinner?)
        if (!this.scatter.identity) {
          return {
            type: "connection_accepted",
            code: 200,
            isError: false,
            message: "Can request Identity"
          };
        }

        // We can connect to Scatter and have an identity (authenticated)
        // can update the UI to logged in state
        return {
          type: "connection_identity",
          code: 200,
          isError: false,
          message: "Identity requested",
          identity: this.scatter.identity
        };
      })
      .catch(err => {
        // tell the user we cannot connect to their wallet
        console.log("scatter.connect()", err);
        this.identityState.setSession(null);
        this.identityState.stateTransition(this.events.ERROR);
        return {
          type: "connection_rejected",
          code: 500,
          isError: true,
          message: "Cannot connect"
        };
      });
  }

  /**
   * Get the user's identity from scatter
   * Similar to a isLoggedIn() or isAuthenticated() method
   */
  identity() {
    this.identityState.stateTransition(this.events.LOADING);
    return this.connect().then(res => {
      if (res.identity) {
        this.identityState.setSession(res.identity);
        this.identityState.stateTransition(this.events.SUCCESS);
      } else if (res.isError) {
        this.identityState.stateTransition(this.events.ERROR);
      } else {
        this.identityState.stateTransition(this.events.INACTIVE);
      }
      return res;
    });
  }

  logout = () => {
    this.identityState.stateTransition(this.events.FORGET_IDENTITY);
    return this.connect().then(connected => {
      // update UI we cannot auto logout from this app without a connection to Scatter wallet
      if (connected.isError) {
        this.identityState.stateTransition(this.events.ERROR);
        return connected;
      }

      if (this.scatter.identity) {
        this.scatter.forgetIdentity();
        this.identityState.setSession(null);
        this.identityState.stateTransition(this.events.INACTIVE);
      }

      return {
        type: "connection_logged_out",
        code: 200,
        isError: false,
        message: "Logged Out"
      };
    });
  };

  login = () => {
    this.identityState.stateTransition(this.events.LOADING);
    // First we need to connect to the user's Scatter.
    return this.connect().then(connected => {
      if (connected.isError) {
        this.identityState.stateTransition(this.events.ERROR);
        return connected;
      }

      // we can connect to Scatter and we have an identity already
      if (!connected.isError && connected.identity) {
        this.identityState.stateTransition(this.events.SUCCESS);
        return { code: 200, message: "OK", identity: connected.identity };
      }

      // Now we need to get an identity from the user.
      // We're also going to require an account that is connected to the network we're using.
      const requiredFields = {
        personal: this.config.personal,
        accounts: this.config.networks
      };

      return this.scatter
        .getIdentity(requiredFields)
        .then(identity => {
          this.identityState.setSession(identity);
          this.identityState.stateTransition(this.events.SUCCESS);
          return { code: 200, message: "OK", identity };
        })
        .catch(err => {
          // user rejected Scatter pop up identity request
          console.log(err);
          this.identityState.stateTransition(this.events.REJECTED);
          return err;
        });
    });
  };
};

export default Auth;
