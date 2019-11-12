import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import FormUserDetails from './FormUserDetails';
import FormPayment from './FormPayment';
import FormPaymentMethod from './FormPaymentMethod';
import FormHelpToKnowYou from './FormHelpToKnowYou';
import Summary from './Summary';
import Confirm from './Confirm';
import Success from './Success';
import Error from './Error';
import { createRegistered, updateRegistered } from '../../services/firebase/api';
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
    loading: true,
    step: 1,
    date: getCurrentDate('-'),
    rateDayBs: 0,
    rateDayUSD: 0,
    paymentMethod: 'transfer',
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
    age: '',
    email: '',
    identity: '',
    phoneNumber: '',
    company: '',
    position: '',
    error: false,
    autoFill: false,
    whereMeetUs: '',
    specification: '',
    bank: '',
    reference: ''
  };

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.paymentMethodType !== this.state.paymentMethodType) {
  //     this.setPaymentAmount(this.state.tickets);
  //   }
  // }

  componentDidMount() {
    this.setState({ loading: false });
  }

  // Handle fields change
  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  handleErrorMessage = () => this.setState({ error: true });

  handleFileURL = fileURL => this.setState({ fileURL });

  handleConfirm = e => {
    e.preventDefault();
    const { handleNext } = this.props;
    const { step, paymentMethodType, paymentAmount, paymentDate, paymentRef, issuingBank, receivingBank, fileURL, tickets, acceptTerms, date, firstName, lastName, age, email, identity, phoneNumber, company, position, whereMeetUs, specification, paymentMethod, bank, reference, autoFill } = this.state;

    // setLoading(true);
    this.setState({ loading: true });

    createRegistered("registered", {
      date,
      firstName,
      lastName,
      age,
      phoneNumber,
      email,
      company,
      position,
      whereMeetUs,
      specification: whereMeetUs === 'Otro' ? specification : null,
      payment: {
        method: paymentMethod,
        bank,
        reference,
        fileURL
      },
      code: null,
      status: "waiting"
    })
      .then(async () => {
        // setLoading(false);
        this.setState({ loading: false });
        handleNext();
      })
      .catch(error => {
        handleNext();
        console.error("Error adding document: ", error);
      });

    // setLoading(false);
    this.setState({ loading: false });

  };

  render() {

    const { classes, step, handleBack, handleNext } = this.props;
    const { paymentMethodType, paymentAmount, paymentDate, paymentRef, issuingBank, receivingBank, fileURL, tickets, acceptTerms, firstName, lastName, age, email, identity, phoneNumber, company, position, autoFill, whereMeetUs, specification, paymentMethod, bank, reference } = this.state;
    const values = { paymentMethodType, paymentAmount, paymentDate, paymentRef, issuingBank, receivingBank, fileURL, tickets, acceptTerms, firstName, lastName, age, email, identity, phoneNumber, company, position, autoFill, whereMeetUs, specification, paymentMethod, bank, reference };

    return (
      <form className={classes.form}>
        <Grid container spacing={2}>
          {(() => {
            switch (step) {
              case 0:
                return (
                  <FormUserDetails
                    handleChange={this.handleChange}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    step={step}
                    values={values}
                  />
                );
              case 1:
                return (
                  <FormHelpToKnowYou
                    handleChange={this.handleChange}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    values={values}
                  />
                );
              case 2:
                return (
                  <FormPayment
                    handleChange={this.handleChange}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    handleFileURL={this.handleFileURL}
                    values={values}
                  />
                );
              case 3:
                return (
                  <Summary
                    handleChange={this.handleChange}
                    handleConfirm={this.handleConfirm}
                    handleBack={handleBack}
                    values={values}
                  />
                );
              case 4:
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