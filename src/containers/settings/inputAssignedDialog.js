import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput
} from '@material-ui/core';

import { typeReasedCode } from '../../assets/utils'; // randomString

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState('');
  const [text, setText] = React.useState('');

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleInput(e) {
    setText(e.target.value);
  }

  function handleAccept() {
    if (text && text.trim() && type) {
      props.onAccept(text, type);
      handleClose();
    }
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Habilitar código
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">¿Para qué, y a quién le darás el código?</DialogTitle>
        <DialogContent>
          <FormControl variant="outlined" required fullWidth>
            <InputLabel htmlFor="select-type">
              Función del Código
            </InputLabel>
            <Select
              id="selectTypeCode"
              required
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
              input={<OutlinedInput name="SelectType" id="select-type" />}
            >
              <MenuItem value="" disabled>
                <em>Seleccionar</em>
              </MenuItem>
              <MenuItem value="more-tickets">{typeReasedCode['more-tickets']}</MenuItem>
              <MenuItem value="platea-tickets">{typeReasedCode['platea-tickets']}</MenuItem>
            </Select>
          </FormControl>
          <DialogContentText style={{ marginTop: '16px' }}>
            Esto servirá para que recuerdes más adelante a que persona le entregaste este código
          </DialogContentText>
          <TextField
            id="name"
            type="text"
            label="Nombre"
            margin="dense"
            onInput={handleInput}
            autoFocus
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAccept} color="primary">
            Habilitar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}