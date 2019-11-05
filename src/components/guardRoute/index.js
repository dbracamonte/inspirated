import React, { Component } from "react";
import { AuthContext } from '../../context/auth';
import { Route, Redirect } from "react-router-dom";

class GuardRoute extends Component {
  render() {
    const { type, ...rest } = this.props;
    const { isLoggedIn } = this.context;

    if (type === 'private' && !isLoggedIn) {
      return <Redirect to="/" />;
    } else if (type === 'public' && isLoggedIn) {
      return <Redirect to="/registered" />;
    }

    return(
      <Route {...rest} />
    );
  }
}

GuardRoute.contextType = AuthContext;

export default GuardRoute;