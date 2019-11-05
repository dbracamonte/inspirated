import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import withStyles from '@material-ui/styles/withStyles';
import { Typography, Chip } from '@material-ui/core';
import { formatMoney } from '../../assets/utils';

const styles = () => ({
  submit: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  textPrice: {
    textAlign: 'right'
  }
});

function FormMain(props) {

  const { values, handleChange, classes } = props;
  const { rateDayBs, rateDayUSD, firstName, lastName, age, identity, phoneNumber, email, paymentMethodType, company, position } = values;
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  }

  return (
    <React.Fragment>
      {/* <Grid item xs={12}>
        <Typography variant="h6">
          Datos del responsable
        </Typography>
        <Typography style={{ color: '#ff6e00' }} variant="subtitle2">
          El responsable será la persona aurotizada para retirar las manillas y recibirá al correo el estatus de la compra.
        </Typography>
      </Grid> */}
      <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          required
          fullWidth
          id="firstName"
          label="Nombre"
          name="firstName"
          autoFocus
          onChange={handleChange}
          defaultValue={firstName}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          required
          fullWidth
          id="lastName"
          label="Apellido"
          name="lastName"
          onChange={handleChange}
          defaultValue={lastName}
        />
      </Grid>
      <Grid item xs={4} sm={2}>
        <TextField
          variant="outlined"
          required
          fullWidth
          id="age"
          label="Edad"
          name="age"
          type="number"
          onChange={handleChange}
          defaultValue={age}
        />
      </Grid>
      <Grid item xs={8} sm={5}>
        <TextField
          variant="outlined"
          required
          fullWidth
          id="identity"
          label="Cédula de identidad"
          name="identity"
          type="number"
          onChange={handleChange}
          defaultValue={identity}
        />
      </Grid>
      <Grid item xs={12} sm={5}>
        <TextField
          variant="outlined"
          required
          fullWidth
          id="phoneNumber"
          label="Número telefónico"
          name="phoneNumber"
          type="number"
          onChange={handleChange}
          defaultValue={phoneNumber}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          required
          fullWidth
          id="email"
          label="Correo electrónico"
          name="email"
          type="email"
          onChange={handleChange}
          defaultValue={email}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          required
          fullWidth
          id="company"
          label="Empresa"
          name="company"
          onChange={handleChange}
          defaultValue={company}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          fullWidth
          id="position"
          label="Cargo"
          name="position"
          onChange={handleChange}
          defaultValue={position}
        />
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">Los campos con asterisco (*) con obligatorios.</span>}
        action={[
          <Button key="omit" color="secondary" size="small" onClick={handleClose}>
            Omitir
          </Button>
        ]}
      />
    </React.Fragment>
  );

}

export default withStyles(styles)(FormMain);