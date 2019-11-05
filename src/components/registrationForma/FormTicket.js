import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Radio,
  FormLabel,
  RadioGroup,
  FormControlLabel,
} from '@material-ui/core';

const pastors = [
  'Apostoles Hernando y Fabiola Brochero',
  'Pastores Germán y  Nelvy Celis',
  'Pastores Jose Gregorio y Elizabeth Gomez',
  'Pastores Darío y Maria Fe Isea',
  'Pastores Alexis y Marisela Parra',
  'Otro'
];

function FormTicket(props) {
  const { user, autoFill, id, applyCodePlatea, } = props;
  const [pastor, setPastor] = useState(user.userPastor ? user.userPastor : (autoFill ? `Pastor here. For ticket ${id + 1}` : ''));
  const [typeTicket, setTypeTicket] = useState(user.userTypeTicket ? user.userTypeTicket : (autoFill ? `invitado-especial` : ''));

  return (
    <Grid style={{ marginBottom: '10px' }} container spacing={2} id={`userTicketContainer-${id}`}>
      <Grid item xs={12}>
        <Typography variant="h6">
          Entrada {id + 1}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          fullWidth
          // required
          id={`userFirstName-${id}`}
          name={`userFirstName-${id}`}
          label="Nombre"
          // onChange={handleChange}
          defaultValue={user.userFirstName ? user.userFirstName : (autoFill ? `Nombre here. For ticket ${id + 1}` : '')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          fullWidth
          // required
          id={`userLastName-${id}`}
          name={`userLastName-${id}`}
          label="Apellido"
          // onChange={handleChange}
          defaultValue={user.userLastName ? user.userLastName : (autoFill ? `Apellido here. For ticket ${id + 1}` : '')}
        />
      </Grid>
      {/* <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          fullWidth
          required
          id={`userIdentity-${id}`}
          name={`userIdentity-${id}`}
          label="Cédula de identidad"
          // onChange={handleChange}
          type="number"
          defaultValue={user.userIdentity ? user.userIdentity : (autoFill ? `identidad here. For ticket ${id + 1}` : '')}
        />
      </Grid> */}
      {/* <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          fullWidth
          required
          id={`userPhoneNumber-${id}`}
          name={`userPhoneNumber-${id}`}
          label="Número telefónico"
          // onChange={handleChange}
          type="number"
          defaultValue={user.userPhoneNumber ? user.userPhoneNumber : (autoFill ? `Número telefónico here. For ticket ${id + 1}` : '')}
        />
      </Grid> */}
      {/* <Grid item xs={12}>
        <TextField
          variant="outlined"
          fullWidth
          id={`userEmail-${id}`}
          name={`userEmail-${id}`}
          label="Correo electrónico"
          // onChange={handleChange}
          type="email"
          defaultValue={user.userEmail ? user.userEmail : (autoFill ? `Correo here. For ticket ${id + 1}` : '')}
        />
      </Grid> */}
      <Grid item xs={12} sm={6}>
        <FormControl variant="outlined" required fullWidth>
          <InputLabel htmlFor="select-pastor">
            Pastor de 12 nacional
          </InputLabel>
          <Select
            id={`userPastor-${id}`}
            required
            value={pastor}
            onChange={(e) => {
              setPastor(e.target.value);
            }}
            input={<OutlinedInput name="userPastor" id="select-pastor" />}
          >
            <MenuItem value="" disabled>
              <em>Seleccionar</em>
            </MenuItem>
            {pastors.map((item, i) => <MenuItem value={item} key={`${i}-${item}`}>{item}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      {pastor === 'Otro' &&
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            fullWidth
            required
            id={`userOtherPastor-${id}`}
            name={`userOtherPastor-${id}`}
            label="Otro Pastor de 12 Nacional"
            // onChange={handleChange}
            defaultValue={user.userOtherPastor ? user.userOtherPastor : (autoFill ? `Pastor here. For ticket ${id + 1}` : '')}
          />
        </Grid>}
      <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          fullWidth
          required
          id={`userChurchName-${id}`}
          name={`userChurchName-${id}`}
          label="Nombre de tu Iglesia"
          // onChange={handleChange}
          defaultValue={user.userChurchName ? user.userChurchName : (autoFill ? `Church Name Here. For ticket ${id + 1}` : '')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          fullWidth
          required
          id={`userPastorChurch-${id}`}
          name={`userPastorChurch-${id}`}
          label="Pastor de tu Iglesia"
          // onChange={handleChange}
          defaultValue={user.userPastorChurch ? user.userPastorChurch : (autoFill ? `Pastor Church Name Here. For ticket ${id + 1}` : '')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          fullWidth
          required
          id={`userNet-${id}`}
          name={`userNet-${id}`}
          label="Líder de 12"
          // onChange={handleChange}
          defaultValue={user.userNet ? user.userNet : (autoFill ? `Red here. For ticket ${id + 1}` : '')}
        />
      </Grid>
      {/* <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          fullWidth
          required
          id={`userLeader-${id}`}
          name={`userLeader-${id}`}
          label="Líder inmediato"
          // onChange={handleChange}
          defaultValue={user.userLeader ? user.userLeader : (autoFill ? `Líder here. For ticket ${id + 1}` : '')}
        />
      </Grid> */}
      {applyCodePlatea &&
        <Grid item xs={12}>
          <FormControl component="fieldset" required>
            <FormLabel component="legend">Selecciona el tipo de ticket</FormLabel>
            <RadioGroup
              aria-label="Selecciona el tipo de ticket"
              id={`userTypeTicketCtrlRadio-${id}`}
              name={`userTypeTicketCtrlRadio-${id}`}
              value={typeTicket}
              onChange={(e) => setTypeTicket(e.target.value)}
            >
              <FormControlLabel value="pastor" control={<Radio />} label="Pastor" />
              <FormControlLabel value="familia" control={<Radio />} label="Familia Pastoral" />
              <FormControlLabel value="discapacitado" control={<Radio />} label="Discapacitado" />
              <FormControlLabel value="invitado-especial" control={<Radio />} label="Invitado Especial" />
            </RadioGroup>
          </FormControl>
          <input type="hidden" defaultValue={typeTicket} id={`userTypeTicket-${id}`} />
        </Grid>}
    </Grid>
  )
}

export default FormTicket;