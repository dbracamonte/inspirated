import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

const channels = ['En un evento', 'Radio / Tv', 'Instagram', 'Referencia de un amigo', 'Otro'];

function FormHelpToKnowYou(props) {

  const { values, handleChange, handleNext, handleBack } = props;
  const { whereMeetUs, specification } = values;

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  const [open, setOpen] = React.useState(false);

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
    if (!whereMeetUs) {
      setOpen(true);
      return;
    }
    handleNext();
  }

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl variant="outlined" required fullWidth>
            <InputLabel ref={inputLabel} htmlFor="where-meet-us">
              ¿Dónde escuchaste de Darío Isea?
            </InputLabel>
            <Select
              value={whereMeetUs}
              onChange={handleChange}
              labelWidth={labelWidth}
              inputProps={{
                name: 'whereMeetUs',
                id: 'where-meet-us',
              }}
            >
              <MenuItem value="" disabled>
                <em>Seleccionar</em>
              </MenuItem>
              {channels.map((item, i) => <MenuItem value={item} key={`${i}-${item}`}>{item}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        {
          whereMeetUs.toLowerCase() === 'otro' &&
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="specification"
              label="Especifique"
              name="specification"
              autoFocus
              onChange={handleChange}
              defaultValue={specification}
            />
          </Grid>
        }
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

export default FormHelpToKnowYou;