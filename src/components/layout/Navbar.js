import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { inject, observer } from "mobx-react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing.unit
  }
});

const LogInOut = props => {
  if (!props.isAuthenticated) {
    return (
      <Button
        variant="contained"
        size="large"
        className={props.classes.button}
        onClick={props.login}
      >
        Login
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      size="large"
      className={props.classes.button}
      onClick={props.logout}
    >
      Logout
    </Button>
  );
};

const Navbar = inject("identityStateTree", "auth")(
  observer(({ identityStateTree, auth, classes }) => {
    const { name, state, isAuthenticated } = identityStateTree;
    const { login, logout } = auth;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              EOS Dapp Seed - {name} ({state})
            </Typography>
            <LogInOut
              state={state}
              isAuthenticated={isAuthenticated}
              login={login}
              logout={logout}
              classes={classes}
            />
          </Toolbar>
        </AppBar>
      </div>
    );
  })
);

// const Navbar = inject("auth", "store")(
//   observer(
//     class Navbar extends Component {
//       login = () => {
//         this.props.auth.login();
//       };

//       logout = () => {
//         this.props.auth.logout();
//       };

//       isAuthenticated = () => {
//         this.props.auth.isAuthenticated();
//       };

//       render() {
//         return (
//           <div>
//             <p style={{ display: "inline-block", paddingRight: "1rem" }}>
//               Nav Bar: {this.props.store.name}
//             </p>
//             <button onClick={this.login}>Login</button>
//             <button onClick={this.logout}>Logout</button>
//             <button onClick={this.isAuthenticated}>isAuthenticated</button>{" "}
//           </div>
//         );
//       }
//     }
//   )
// );

Navbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Navbar);
