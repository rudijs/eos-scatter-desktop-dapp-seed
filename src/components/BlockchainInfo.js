import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";


const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    overflow: "auto"
  },
  info: {
    fontWeight: "bold"
  }
});

class BlockchainInfo extends Component {
  state = {
    info: {}
  };

  componentDidMount() {
    fetch("http://localhost:7777/v1/chain/get_info")
      .then(res => res.json())
      .then(res => this.setState({ info: res }))
      .catch(err => this.setState({ info: { error: err.message } }));
  }

  render() {
    const { classes } = this.props;
    const info = Object.keys(this.state.info).map((key, index) => {
      return (
        <Typography key={index}>
          <span className={classes.info}>{key}</span>: {this.state.info[key]}
        </Typography>
      );
    });

    return (
      <div>
        <Paper className={classes.root} elevation={1}>
          <Typography variant="h4">EOS Blockchain Info</Typography>
          {info}
          <Link to="/about">About Us</Link>
        </Paper>
      </div>
    );
  }
}

BlockchainInfo.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BlockchainInfo);
