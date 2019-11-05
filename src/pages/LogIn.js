import React, { Component } from "react";
import LogIn from "../containers/logIn";
import { auth } from "../services/firebase";

class LogInPage extends Component {

  state = {
    email: '',
    password: '',
    noValid: false,
  }

  componentDidMount() {
    // this.handleCreate({ email: 'hugosimon.2016@hotmail.com', password: 'hugo1234', name: 'Hugo Martínez' });
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleCreate = data => {
    auth.createUserWithEmailAndPassword(data.email, data.password)
      .then((user) => {
        return user.user.updateProfile({
          displayName: data.name,
        })
      }).catch((error) => {
        console.log(error);
      });
  }

  handleSubmit = event => {

    event.preventDefault();

    let { email, password } = this.state;

    this.setState({ noValid: false, });

    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // console.log(errorCode, errorMessage);
        // if (errorCode === 'auth/wrong-password') {
        this.setState({ noValid: true, });
        // }
      });

  }

  render() {
    return (
      <LogIn handleChange={this.handleChange} handleSubmit={this.handleSubmit} noValid={this.state.noValid} />
    );
  }
}

export default LogInPage;
