import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";

import history from "../../history";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  button: {
    margin: theme.spacing.unit
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  list: {
    width: 250
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

// const Navbar = inject("identityState", "auth")(
//   observer(({ identityState, auth, classes }) => {
//     const { name, state, isAuthenticated } = identityState;
//     const { login, logout } = auth;

//     return (
//       <div className={classes.root}>
//         <AppBar position="static">
//           <Toolbar>
//             <Typography variant="h6" color="inherit" className={classes.grow}>
//               EOS Dapp - {name} ({state})
//             </Typography>
//             <LogInOut
//               state={state}
//               isAuthenticated={isAuthenticated}
//               login={login}
//               logout={logout}
//               classes={classes}
//             />
//           </Toolbar>
//         </AppBar>
//       </div>
//     );
//   })
// );

const Navbar = inject("identityState", "auth")(
  observer(
    class Navbar2 extends Component {
      state = {
        top: false,
        left: false,
        bottom: false,
        right: false
      };

      toggleDrawer = (side, open) => () => {
        this.setState({
          [side]: open
        });
      };

      render() {
        const {
          name,
          currentState,
          isAuthenticated
        } = this.props.identityState;
        const { login, logout } = this.props.auth;
        const { classes } = this.props;

        console.log(101, currentState);
        console.log(201, currentState.inactive);

        const sideList = (
          <div className={classes.list}>
            <List component="nav">
              <ListItem button onClick={() => history.push("/")}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  history.push("/about");
                }}
              >
                <ListItemIcon>
                  <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary="About Us" />
              </ListItem>
            </List>
            <Divider />
            <List component="nav">
              <ListItem button>
                <ListItemText primary="Trash" />
              </ListItem>
              <ListItem button component="a" href="#simple-list">
                <ListItemText primary="Spam" />
              </ListItem>
            </List>
          </div>
        );

        return (
          <div className={classes.root}>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="Menu"
                  onClick={this.toggleDrawer("left", true)}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  color="inherit"
                  className={classes.grow}
                >
                  {/* EOS Dapp - {name} ({currentState}) */}
                  EOS Dapp - {name}
                </Typography>

                <LogInOut
                  isAuthenticated={isAuthenticated}
                  login={login}
                  logout={logout}
                  classes={classes}
                />
              </Toolbar>
            </AppBar>
            <Drawer
              open={this.state.left}
              onClose={this.toggleDrawer("left", false)}
            >
              <div
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer("left", false)}
                onKeyDown={this.toggleDrawer("left", false)}
              >
                {sideList}
              </div>
            </Drawer>
          </div>
        );
      }
    }
  )
);

Navbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Navbar);
