import React, { Component } from "react";
import { AuthContext } from '../../context/auth';
import { withStyles } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = () => ({
  progress: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

class Root extends Component {
  render() {
    const { children, classes } = this.props;
    const { authReady } = this.context;

    if (!authReady) {
      return <div className={classes.progress}><CircularProgress /></div>
    }

    return children;
  }
}

Root.contextType = AuthContext;

export default withStyles(styles)(Root);