import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const channels = ['En un evento', 'Radio / Tv', 'Instagram', 'Referencia de un amigo', 'Otro'];

function FormHelpToKnowYou(props) {

  const { values, handleChange } = props;
  const { whereMeetUs, specification } = values;

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  return (
    <React.Fragment>
      <Grid item xs={12} sm={12}>
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
        <Grid item xs={12} sm={12}>
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
    </React.Fragment>
  );
}

export default FormHelpToKnowYou;