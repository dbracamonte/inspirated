import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import FormMain from './FormMain';
import FormPaymentMethod from './FormPaymentMethod';
import FormUserDetails from './FormUserDetails';
import Confirm from './Confirm';
import Success from './Success';
import Error from './Error';
import { getRate } from '../../services/firebase/api';
import { arrayPartitions } from '../../assets/utils';

const styles = theme => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  }
});

const getCurrentDate = (separator = '') => {

  let newDate = new Date()
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
};

export class RegistrationForm extends Component {
  state = {
    step: 1,
    rateDayBs: 0,
    rateDayUSD: 0,
    applyCode: false,
    applyCodePlatea: false,
    code: '',
    codePlatea: '',
    codeData: {},
    codeDataPlatea: {},
    paymentMethodType: 'cash',
    paymentAmount: 0,
    paymentDate: getCurrentDate('-'),
    paymentRef: '',
    issuingBank: '',
    receivingBank: '',
    fileURL: null,
    acceptTerms: false,
    tickets: 0,
    firstName: '',
    lastName: '',
    email: '',
    identity: '',
    phoneNumber: '',
    net: null,
    leader: null,
    users: [],
    error: false,
    autoFill: false,
  };

  tryFetch = 0;

  componentDidMount() {
    this.fetchRates();
  }

  fetchRates = () => {
    this.tryFetch++;

    if (this.tryFetch >= 3) return;

    getRate().then(doc => {
      this.setState({
        rateDayBs: doc.data().bs,
        rateDayUSD: doc.data().usd
      });
    }).catch(error => {
      if (error.code === 'unavailable') {
        this.fetchRates();
        console.log("Trying again beacuse code unavailable");
      }
      console.error("Error fetching RateDay: ", error);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.paymentMethodType !== this.state.paymentMethodType) {
      this.setPaymentAmount(this.state.tickets);
    }
  }

  // Proceed to next step
  nextStep = () => {
    const { step } = this.state;

    if (step + 1 === 3) {
      this.setUsers();
    }

    // this.setState({ step: step + 1, });
    this.setState(prevState => ({ step: step + 1, tickets: (prevState.applyCode || (!prevState.applyCode && prevState.tickets <= 5)) ? prevState.tickets : 0 }));
  };

  // Go back to prev step
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };

  // Handle fields change
  handleChange = e => {

    const { applyCode } = this.state;

    const [name, value] = [e.target.name, e.target.value];

    if (name === 'tickets' && ((!applyCode && value > 5) || (applyCode && value > 100))) {
      e.target.value = value.slice(0, -1);
      return;
    }

    if (e.target.id && e.target.id.includes("-")) {
      const [selector, id] = e.target.id.split('-');

      if (["userFirstName", "userLastName", "userIdentity", "userPhoneNumber", "userEmail", "userPastor", "userNet", "userLeader"].includes(selector)) {
        let users = this.state.users
        users[id][selector] = value;
        this.setState({ users });
      }

    } else {
      this.setState({ [name]: value });
    }

    if (name === 'tickets') {
      this.setPaymentAmount(value);
    }

  };

  handleCheckChange = e => this.setState({ [e.target.name]: e.target.checked });

  handleErrorMessage = () => this.setState({ error: true });

  handleFileURL = fileURL => this.setState({ fileURL });

  setPaymentAmount = (tickets) => {
    const { rateDayBs, rateDayUSD, paymentMethodType, } = this.state;

    const numTickets = Number(tickets);

    let amount = 0;

    if (paymentMethodType === 'transfer') {
      amount = Number(tickets) * rateDayBs;
    } else {
      const arrayTickets = [];

      for (let i = 0; i < numTickets; i++) {
        arrayTickets.push(i + 1);
      }

      const partitionsTickets = arrayPartitions(arrayTickets, 3);
      let totalTicketPromo = 0;

      partitionsTickets.forEach(part => {
        if (part.length === 3) {
          totalTicketPromo += 2;
        } else {
          totalTicketPromo += part.length;
        }
      });

      amount = totalTicketPromo * rateDayUSD;
    }

    this.setState({
      paymentAmount: amount,
    });
  }

  setUsers = () => {
    const { tickets, users } = this.state;

    if (tickets > users.length) {
      console.log("Agregando nuevos tickets");
      const numDifence = tickets - users.length;
      const newTickets = [];

      for (let i = 0; i < numDifence; i++) {
        newTickets.push({
          userLastName: "",
          userFirstName: "",
          // userIdentity: "",
          // userPhoneNumber: "",
          // userEmail: "",
          // userLeader: "",
          userNet: "",
          userPastor: "",
          userChurchName: "",
          userOtherPastor: "",
          userPastorChurch: "",
        });
      }

      this.setState((prevState) => ({
        users: [...prevState.users, ...newTickets]
      }));
    } else if (tickets < users.length) {
      console.log("Quitando tickets");
      const numDifence = users.length - tickets;

      this.setState((prevState) => ({
        users: prevState.users.slice(0, -numDifence)
      }));
    }
  }

  mofiedState = (state = {}, callback = () => { }) => {
    this.setState(state, callback);
  }

  render() {

    const { classes } = this.props;
    const { step, rateDayBs, rateDayUSD, applyCode, applyCodePlatea, code, codePlatea, codeData, codeDataPlatea, paymentMethodType, paymentAmount, paymentDate, paymentRef, issuingBank, receivingBank, fileURL, tickets, acceptTerms, firstName, lastName, email, identity, phoneNumber, net, leader, users, autoFill } = this.state;
    const values = { rateDayBs, rateDayUSD, applyCode, applyCodePlatea, code, codePlatea, codeData, codeDataPlatea, paymentMethodType, paymentAmount, paymentDate, paymentRef, issuingBank, receivingBank, fileURL, tickets, acceptTerms, firstName, lastName, email, identity, phoneNumber, net, leader, users, autoFill };

    return (
      <form className={classes.form}>
        <Grid container spacing={2}>
          {(() => {
            switch (step) {
              case 1:
                return (
                  <FormMain
                    nextStep={this.nextStep}
                    handleChange={this.handleChange}
                    handleCheckChange={this.handleCheckChange}
                    values={values}
                  />
                );
              case 2:
                return (
                  <FormPaymentMethod
                    nextStep={this.nextStep}
                    prevStep={this.prevStep}
                    handleChange={this.handleChange}
                    handleCheckChange={this.handleCheckChange}
                    handleFileURL={this.handleFileURL}
                    values={values}
                  />
                );
              case 3:
                return (
                  <FormUserDetails
                    nextStep={this.nextStep}
                    prevStep={this.prevStep}
                    handleChange={this.handleChange}
                    values={values}
                    mofiedState={this.mofiedState}
                  />
                );
              case 4:
                return <Confirm
                  nextStep={this.nextStep}
                  prevStep={this.prevStep}
                  values={values}
                />;
              case 5:
                if (this.error) {
                  return <Error />;
                }
                return <Success values={values} />;
              // no default
            }
          })()}

        </Grid>
      </form>
    );
  }
}

export default withStyles(styles)(RegistrationForm);