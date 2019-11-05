import React, { Component } from "react";
import { watchUserChanges, logOut } from '../services/firebase';

export const AuthContext = React.createContext();

export class AuthContextProvider extends Component {
  state = {
    user: null,
    logOut,
    authReady: false,
    isLoggedIn: false,
  }

  componentDidMount() {
    watchUserChanges(user => {
      if (user) {
        this.setState({
          authReady: true,
          isLoggedIn: true,
          user
        })
      } else {
        this.setState({
          authReady: true,
          isLoggedIn: false,
          user: null
        })
      }
    })
  }

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}

export const AuthContextConsumer = AuthContext.Consumer;