import React, { Component } from 'react';
import FormTicket from './FormTicket';
import {
  Grid,
  Button,
  Snackbar,
  Link,
} from '@material-ui/core';

class FormUserDetails extends Component {
  state = {
    open: false,
    showForm: 20,
  }

  getDataForm = () => {
    const { values: { users } } = this.props;
    const usersFormData = [];

    for (let i = 0; i < users.length; i++) {
      const userFirstName = document.getElementById(`userFirstName-${i}`);
      const userLastName = document.getElementById(`userLastName-${i}`);
      // const userIdentity = document.getElementById(`userIdentity-${i}`);
      // const userPhoneNumber = document.getElementById(`userPhoneNumber-${i}`);
      // const userEmail = document.getElementById(`userEmail-${i}`);
      // const userLeader = document.getElementById(`userLeader-${i}`);
      const userNet = document.getElementById(`userNet-${i}`);
      const userPastor = document.getElementById(`userPastor-${i}`);
      const userChurchName = document.getElementById(`userChurchName-${i}`);
      const userPastorChurch = document.getElementById(`userPastorChurch-${i}`);
      const userTypeTicket = document.getElementById(`userTypeTicket-${i}`);
      const userOtherPastor = document.getElementById(`userOtherPastor-${i}`);

      usersFormData.push({
        userFirstName: userFirstName ? userFirstName.value : '',
        userLastName: userLastName ? userLastName.value : '',
        // userIdentity: userIdentity ? userIdentity.value : '',
        // userPhoneNumber: userPhoneNumber ? userPhoneNumber.value : '',
        // userEmail: userEmail ? userEmail.value : '',
        // userLeader: userLeader ? userLeader.value : '',
        userNet: userNet ? userNet.value : '',
        userPastor: userPastor ? userPastor.value : '',
        userChurchName: userChurchName ? userChurchName.value : '',
        userOtherPastor: userOtherPastor ? userOtherPastor.value : '',
        userPastorChurch: userPastorChurch ? userPastorChurch.value : '',
        userTypeTicket: userTypeTicket ? userTypeTicket.value : '',
      });
    }

    return usersFormData;
  }

  validForm = (redirectToNoValid = false) => {
    const { values: { users, applyCodePlatea } } = this.props;
    let isValid = true;
    let indexNoValid = -1;

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const isValidUser =
        // user.userFirstName && user.userLastName && user.userIdentity && user.userPhoneNumber && user.userLeader &&
        user.userNet && user.userChurchName && user.userPastorChurch &&
        ((user.userPastor && user.userPastor !== 'Otro') || ((user.userPastor === 'Otro' && user.userOtherPastor))) &&
        ((applyCodePlatea && user.userTypeTicket) || !applyCodePlatea);

      if (!isValidUser) {
        isValid = false;
        indexNoValid = i;
        break;
      }
    };

    if (redirectToNoValid && indexNoValid !== -1) {
      const containerTicket = document.getElementById(`userTicketContainer-${indexNoValid}`);
      if (containerTicket) {
        containerTicket.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }

    return isValid;
  }

  handleSaveInData(callback = () => { }) {
    const data = this.getDataForm();

    this.props.mofiedState({ users: data }, callback);
  }

  handleContinue = e => {
    e.preventDefault();

    this.handleSaveInData(() => {
      if (this.validForm(true)) {
        this.props.nextStep();
      } else {
        this.setState({ open: true });
      }
    });
  };

  handleBack = e => {
    e.preventDefault();
    this.handleSaveInData(this.props.prevStep);
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  }

  render() {
    const { values } = this.props; // handleChange
    const { users, tickets, autoFill, applyCodePlatea, } = values;
    const { open, showForm } = this.state;

    return (
      <React.Fragment>
        {users.slice(0, showForm).map((user, id) => (
          <FormTicket
            id={id}
            key={`user-${id}`}
            user={user}
            autoFill={autoFill}
            applyCodePlatea={applyCodePlatea}
          />
        ))}
        <Grid item xs={12}>
          {showForm < users.length &&
            <Link
              component="button"
              variant="body2"
              onClick={(e) => {
                e.preventDefault();
                this.setState(prevState => ({ showForm: prevState.showForm + prevState.showForm }));
              }}
            >
              Cargar Más
          </Link>}
        </Grid>
        {tickets > 5 &&
          <Grid item xs={12}>
            Mostrando {showForm > users.length ? users.length : showForm} de {tickets}
          </Grid>}
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={this.handleContinue}
          >
            Continuar
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            onClick={this.handleBack}
          >
            Atrás
        </Button>
        </Grid>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={open}
          autoHideDuration={5000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Los campos con asterisco (*) con obligatorios.</span>}
          action={[
            <Button key="omit" color="secondary" size="small" onClick={this.handleClose}>
              Omitir
          </Button>
          ]}
        />

      </React.Fragment>
    );
  }
}

export default FormUserDetails;