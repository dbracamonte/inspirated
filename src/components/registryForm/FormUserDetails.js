import React, { useState } from 'react';
import { Grid, Button, TextField, Snackbar } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

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

  const { values, handleChange, handleNext } = props;
  const { firstName, lastName, age, phoneNumber, email, company, position } = values;
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  }

  const handleContinue = () => {
    if (!firstName || !lastName || !age || !phoneNumber || !email) {
      setOpen(true);
      return;
    }
    handleNext();
  }

  return (
    <React.Fragment>
      <Grid container spacing={3}>
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
        <Grid item xs={3} sm={4}>
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
        <Grid item xs={9} sm={8}>
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
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleContinue}
          >
            Continuar
          </Button>
        </Grid>
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