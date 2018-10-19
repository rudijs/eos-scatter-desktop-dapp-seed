const Auth = class Auth {
  constructor(options) {
    // Always remember to null out the window.scatter reference
    // if you don't extensions will be able to catch that reference and make
    // requests to the user's Scatter on behalf of your domain, and you will have to take responsibility.
    window.scatter = null;

    this.config = options.config;
    this.identityStateTree = options.identityStateTree;
    this.scatter = options.scatter;
  }

  connect() {
    return this.scatter
      .connect(this.config.appName)
      .then(connected => {
        // If the user does not have Scatter or it is Locked or Closed
        // reset the application state
        if (!connected || !this.scatter.identity) {
          this.identityStateTree.setSession(null);
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
        this.identityStateTree.setSession(null);
        this.identityStateTree.setState("initial");
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
    this.identityStateTree.setState("loading");
    return this.connect().then(res => {
      console.log(101, res);
      if (res.identity) {
        this.identityStateTree.setSession(res.identity);
        this.identityStateTree.setState("loaded");
      } else if (res.isError) {
        this.identityStateTree.setState("error");
      } else {
        this.identityStateTree.setState("initial");
      }
      return res;
    });
  }

  logout = () => {
    this.identityStateTree.setState("loading");
    return this.connect().then(connected => {
      // update UI we cannot auto logout from this app without a connection to Scatter wallet
      if (connected.isError) {
        this.identityStateTree.setState("error");
        return connected;
      }

      if (this.scatter.identity) {
        this.scatter.forgetIdentity();
        this.identityStateTree.setSession(null);
        this.identityStateTree.setState("initial");
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
    this.identityStateTree.setState("loading");
    // First we need to connect to the user's Scatter.
    return this.connect().then(connected => {
      if (connected.isError) {
        this.identityStateTree.setState("error");
        return connected;
      }

      // we can connect to Scatter and we have an identity already
      if (!connected.isError && connected.identity) {
        this.identityStateTree.setState("loaded");
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
          this.identityStateTree.setSession(identity);
          this.identityStateTree.setState("loaded");
          return { code: 200, message: "OK", identity };
        })
        .catch(err => {
          // user rejected Scatter pop up identity request
          console.log(err);
          this.identityStateTree.setState("error");
          return err;
        });
    });
  };
};

export default Auth;
