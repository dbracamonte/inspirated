import React, { useState } from 'react';
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Grid,
  Button,
  TextField,
  Paper,
  Snackbar,
  Typography
} from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import UploadFile from '../uploadFile';

const styles = theme => ({
  info: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: theme.palette.primary.main,
    padding: theme.spacing(2),
    backgroundColor: '#f5f5f5'
  }
});

const banks = ['Venezuela', 'Banesco', 'Provincial', 'Mercantil', 'Bicentenario', 'B.O.D.', 'Del Tesoro', 'Nacional de Crédito', 'Bancaribe', 'Vzlno. de Crédito', 'Exterior', 'Fondo Común', 'Banplus', 'Plaza', 'Activo', 'Banfanb', 'Caroní', 'Sofitasa', 'Bancrecer', 'Del Sur', '100 % Banco', 'Bancamiga', 'Agrícola de Vzla.', 'Citibank', 'Mi Banco', 'Bangente'];
const paymentMethods = ['Transferencia', 'Pago móvil'];

function FormPayment(props) {

  const { values, handleChange, handleFileURL, handleNext, handleBack, classes } = props;
  const { bank, paymentMethod, reference } = values;
  const [open, setOpen] = useState(false);

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  }

  const handleContinue = () => {
    if (!paymentMethod || !bank || !reference) {
      setOpen(true);
      return;
    }
    handleNext();
  }

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <FormControl variant="outlined" required fullWidth>
          <InputLabel ref={inputLabel} htmlFor="payment-method">
            Método de pago
          </InputLabel>
          <Select
            value={paymentMethod}
            onChange={handleChange}
            labelWidth={labelWidth}
            inputProps={{
              name: 'paymentMethod',
              id: 'payment-method',
            }}
          >
            <MenuItem value="" disabled>
              <em>Seleccionar</em>
            </MenuItem>
            {paymentMethods.map((item, i) => <MenuItem value={item} key={`${i}-${item}`}>{item}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      {
        paymentMethod === 'Transferencia' &&
        <Grid item xs={12} style={{ paddingBottom: 16 }}>
          <Paper className={classes.info}>
            <Typography variant="h6">
              Cuenta a transferir
            </Typography>
            <Typography variant="body2">
              <b>Beneficiario:</b> Dayana Morales
            </Typography>
            <Typography variant="body2">
              <b>Cédula de identidad:</b> 21.443.999
            </Typography>
            <Typography variant="body2">
              <b>Nombre del banco:</b> Banesco
            </Typography>
            <Typography variant="body2">
              <b>Número de cuenta:</b> 01340034290343098755
            </Typography>
          </Paper>
        </Grid>
      }
      {
        paymentMethod === 'Pago móvil' &&
        <Grid item xs={12} style={{ paddingBottom: 16 }}>
          <Paper className={classes.info}>
            <Typography variant="h6">
              Cuenta a transferir
            </Typography>
            <Typography variant="body2">
              <b>Cédula de identidad:</b> 21.443.999
            </Typography>
            <Typography variant="body2">
              <b>Banco:</b> Banesco (0134)
            </Typography>
            <Typography variant="body2">
              <b>Número de teléfono:</b> (0424) 3180731
            </Typography>
          </Paper>
        </Grid>
      }
      <Grid item xs={12} sm={6}>
        <FormControl variant="outlined" required fullWidth>
          <InputLabel ref={inputLabel} htmlFor="bank">
            Banco emisor
          </InputLabel>
          <Select
            value={bank}
            onChange={handleChange}
            labelWidth={labelWidth}
            inputProps={{
              name: 'bank',
              id: 'bank',
            }}
          >
            <MenuItem value="" disabled>
              <em>Seleccionar</em>
            </MenuItem>
            {banks.map((item, i) => <MenuItem value={item} key={`${i}-${item}`}>{item}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          required
          fullWidth
          id="reference"
          label="Refencia"
          name="reference"
          onChange={handleChange}
          defaultValue={reference}
        />
      </Grid>
      <Grid item xs={12}>
        <UploadFile onUpload={handleFileURL} />
      </Grid>
      <Grid item xs={6}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleBack}
        >
          Volver
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleContinue}
        >
          Continuar
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

export default withStyles(styles)(FormPayment);