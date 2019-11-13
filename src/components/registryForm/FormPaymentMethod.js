import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import UploadFile from '../uploadFile';
import { formatMoney } from '../../assets/utils';

const banks = ['Venezuela', 'Banesco', 'Provincial', 'Mercantil', 'Bicentenario', 'B.O.D.', 'Del Tesoro', 'Nacional de Crédito', 'Bancaribe', 'Vzlno. de Crédito', 'Exterior', 'Fondo Común', 'Banplus', 'Plaza', 'Activo', 'Banfanb', 'Caroní', 'Sofitasa', 'Bancrecer', 'Del Sur', '100 % Banco', 'Bancamiga', 'Agrícola de Vzla.', 'Citibank', 'Mi Banco', 'Bangente'];

function FormPaymentMethod(props) {

  const { values, handleChange, handleCheckChange, handleFileURL } = props;
  const { applyCode, rateDayBs, paymentMethodType, paymentAmount, paymentDate, paymentRef, issuingBank, receivingBank, tickets, acceptTerms } = values;
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  }

  return (
    <React.Fragment>
      {
        paymentMethodType !== "" &&
        <React.Fragment>
          <Grid item xs={6} sm={paymentMethodType === 'cash' ? 6 : 3}>
            <TextField
              name="tickets"
              variant="outlined"
              required
              fullWidth
              autoFocus
              id="tickets"
              label="Entradas"
              type="number"
              InputProps={{ inputProps: { min: 1, max: applyCode ? 100 : 5 } }}
              onChange={handleChange}
              defaultValue={tickets}
            />
          </Grid>
          <Grid item xs={6} sm={paymentMethodType === 'cash' ? 6 : 4}>
            <TextField
              disabled
              name="paymentAmount"
              variant="outlined"
              required
              fullWidth
              id="paymentAmount"
              label="Monto a pagar"
              value={(paymentMethodType === "transfer" ? rateDayBs * tickets : paymentAmount)} // rateDayUSD
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  {paymentMethodType === "transfer" ? 'Bs.' : '$'}
                </InputAdornment>,
              }}
            />
          </Grid>
          {paymentMethodType === 'cash' &&
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox name="acceptTerms" checked={acceptTerms} onChange={handleCheckChange} color="primary" />}
                label={`Entiendo que de no realizar el pago por ${formatMoney(paymentAmount)} $ en efectivo a un personal autorizado de la MCI de Turmero en las próximas 48 Horas, el registro será rechazado.`}
                required
              />
            </Grid>}
          {paymentMethodType === "transfer" &&
            <React.Fragment>
              <Grid item xs={6} sm={5}>
                <TextField
                  name="paymentDate"
                  variant="outlined"
                  required
                  fullWidth
                  id="paymentDate"
                  label="Fecha de pago"
                  type="date"
                  onChange={handleChange}
                  defaultValue={paymentDate}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" required fullWidth>
                  <InputLabel htmlFor="select-issuing-bank">
                    Banco emisor
                  </InputLabel>
                  <Select
                    id="issuingBank"
                    value={issuingBank}
                    onChange={handleChange}
                    input={<OutlinedInput name="issuingBank" id="select-issuing-bank" />}
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccionar</em>
                    </MenuItem>
                    {banks.map((item, i) => <MenuItem value={item} key={`${i}-${item}`}>{item}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" required fullWidth>
                  <InputLabel htmlFor="select-receiving-bank">
                    Banco receptor
                  </InputLabel>
                  <Select
                    id="receivingBank"
                    value={receivingBank}
                    onChange={handleChange}
                    input={<OutlinedInput name="receivingBank" id="select-receiving-bank" />}
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccionar</em>
                    </MenuItem>
                    {/* <MenuItem value="Banesco">Banesco</MenuItem> */}
                    <MenuItem value="Bancaribe">Bancaribe</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="paymentRef"
                  variant="outlined"
                  required
                  fullWidth
                  id="paymentRef"
                  label="Referencia"
                  onChange={handleChange}
                  defaultValue={paymentRef}
                />
              </Grid>
              <Grid item xs={12}>
                <UploadFile onUpload={handleFileURL} />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox name="acceptTerms" checked={acceptTerms} onChange={handleCheckChange} color="primary" />}
                  label={`Entiendo que de no haber hecho la transferencia con el monto adecuado de ${formatMoney(paymentAmount)} BsS. el registro será rechazado.`}
                  required
                />
              </Grid>
            </React.Fragment>}
        </React.Fragment>
      }

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

export default FormPaymentMethod;