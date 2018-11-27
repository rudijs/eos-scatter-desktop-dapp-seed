import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

const styles = (theme: any) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    overflow: "auto"
  }
});

function About(props: any) {
  const { classes } = props;
  return (
    <div>
      <Paper className={classes.root}>
        <Typography>About Us.</Typography>
        {/* <Button variant="contained" component={Link} to="/"> */}
        {/* https://github.com/mui-org/material-ui/issues/8598#issuecomment-399166441 */}
        <Button
          variant="contained"
          component={({ innerRef, ...props }) => <Link {...props} to="/" />}
        >
          Home
        </Button>
      </Paper>
    </div>
  );
}

// todo:rudijs check this works as expected
About.prototypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(About);
