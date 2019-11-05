import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/styles/withStyles';
import { getFilterRegistered } from '../../services/firebase/api';
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

function getValidMsgs(validCode) {
  let messageValid = '';
  let messageValidPlatea = '';

  if (validCode === 'no-valid-active' || validCode === 'no-valid-exits') {
    messageValid = 'El código introducido no es válido';
  } else if (validCode === 'no-valid-type') {
    messageValid = 'El código introducido no es válido para optar por más de 5 entradas';
    messageValidPlatea = 'El código introducido no es válido para optar por entradas a platea';
  } else if (validCode === 'no-valid-used') {
    messageValid = 'El código introducido no está disponible';
  } else if (validCode === 'no-valid-empty') {
    messageValid = 'Debes introducir un código';
  }

  return [messageValid, messageValidPlatea || messageValid];
}

function FormMain(props) {

  const { values, handleChange, handleCheckChange, nextStep, classes } = props;
  const { rateDayBs, rateDayUSD, firstName, lastName, identity, phoneNumber, email, paymentMethodType, applyCode, applyCodePlatea, code, codePlatea } = values;
  const [open, setOpen] = useState(false);
  const [isValidCode, setIsValidCode] = useState('no-code');
  const [isValidCodePlatea, setIsValidCodePlatea] = useState('no-code');

  const handleContinue = async e => {
    e.preventDefault();

    if (!firstName || !lastName || !identity || !phoneNumber || !email || !paymentMethodType) {
      setOpen(true);
      return;
    }

    if (applyCode && code && isValidCode !== 'valid') {
      setIsValidCode('validating');
      const data = await getFilterRegistered('codes', { field: 'code', operator: '==', value: code });

      console.log("Validation entradas data: ", data);

      if (data && !data.empty) {
        const cod = Object.assign(data.docs[0].data(), { id: data.docs[0].id });
        if (cod.status === 'released' && cod.type === 'more-tickets') {
          setIsValidCode('valid');
          handleChange({ target: { value: cod, name: 'codeData' } });
        } else if (cod.status === 'released' && cod.type !== 'more-tickets') {
          return setIsValidCode('no-valid-type');
        } else if (cod.status === 'detained') {
          return setIsValidCode('no-valid-active');
        } else if (cod.status === 'used') {
          return setIsValidCode('no-valid-used');
        }
      } else {
        return setIsValidCode('no-valid-exits');
      }
    } else if (applyCode && !code) {
      return setIsValidCode('no-valid-empty');
    }

    if (applyCodePlatea && codePlatea && isValidCodePlatea !== 'valid') {
      setIsValidCodePlatea('validating');
      const data = await getFilterRegistered('codes', { field: 'code', operator: '==', value: codePlatea });

      if (data && !data.empty) {
        const cod = Object.assign(data.docs[0].data(), { id: data.docs[0].id });
        if (cod.status === 'released' && cod.type === 'platea-tickets') {
          setIsValidCodePlatea('valid');
          handleChange({ target: { value: cod, name: 'codeDataPlatea' } });
        } else if (cod.status === 'released' && cod.type !== 'platea-tickets') {
          return setIsValidCodePlatea('no-valid-type');
        } else if (cod.status === 'detained') {
          return setIsValidCodePlatea('no-valid-active');
        } else if (cod.status === 'used') {
          return setIsValidCodePlatea('no-valid-used');
        }
      } else {
        return setIsValidCodePlatea('no-valid-exits');
      }
    } else if (applyCodePlatea && !codePlatea) {
      return setIsValidCodePlatea('no-valid-empty');
    }

    nextStep();
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  }

  const messageValid = getValidMsgs(isValidCode)[0];
  const messageValidPlatea = getValidMsgs(isValidCodePlatea)[1];

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Typography className={classes.textPrice} variant="subtitle1">
          <b>Precio del día: </b>
          {/* <Chip label={`${rateDayBs} Bs. / $${formatMoney(rateDayUSD, 0)}`} variant="outlined" /> */}
          <Chip label={`${formatMoney(rateDayUSD, 0)} $`} variant="outlined" />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">
          Datos del responsable
        </Typography>
        <Typography style={{ color: '#ff6e00' }} variant="subtitle2">
          El responsable será la persona aurotizada para retirar las manillas y recibirá al correo el estatus de la compra.
        </Typography>
      </Grid>
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
      <Grid item xs={12} sm={6}>
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
      <Grid item xs={12} sm={6}>
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
      <Grid item xs={12}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleContinue}
          className={classes.submit}
        >
          Continuar
          {(isValidCode === 'validating' || isValidCodePlatea === 'validating') && (<CircularProgress size={24} className={classes.buttonProgress} color="secondary" />)}
        </Button>
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