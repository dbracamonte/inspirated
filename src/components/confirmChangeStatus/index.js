import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  formControl: {

  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function ConfirmChangeStatus(props) {
  const { onClose, open, status, dataSelected } = props;
  const [comment, setComment] = useState('');

  if (!dataSelected)
    return <div></div>;

  function handleAccept() {
    if (!comment && status === 'rejected') {
      return;
    }

    if (status === 'delivered') {
      onClose('approvedChangeToDelivered', '');
    } else {
      onClose('approvedChangeStatus', comment);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={true}
      aria-labelledby="customized-dialog-title"
    >
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        Confirmar Acción de&nbsp;
        <b>{status === 'rejected' && 'Rechazar'}</b>
        <b>{status === 'approved' && 'Aprobar'}</b>
        <b>{status === 'delivered' && 'Manilla Entregada'}</b>
      </DialogTitle>
      <DialogContent dividers>
        {status === 'rejected' &&
          <Typography gutterBottom>
            ¿Estás seguro de que deseas rechazar la transferencia seleccionada? Esta acción es irrebersible. El responsable de la inscripción será notificado.
          </Typography>}
        {status === 'approved' &&
          <>
            <Typography gutterBottom>
              Al Aprobar confirmas que:
            </Typography>
            <Typography gutterBottom>
              1) Se recibió la transferencia en el banco específicado.
            </Typography>
            <Typography gutterBottom>
              2) Todos los datos concuerdan y han sidos comprobados.
            </Typography>
          </>}
        {status === 'delivered' && (
          <>
            <Typography gutterBottom>
              ¿Estás seguro de que le entregará la manilla al responsable de esta inscripción? Esta acción es irrebersible. Al aceptar confirmas que:
            </Typography>
            <Typography gutterBottom>
              1) El responsable está presente para retirar la manilla
            </Typography>
            <Typography gutterBottom>
              2) Se han verificado los datos del responsable y concuerdan con los registrados en la inscripción
            </Typography>
          </>
        )}
        {status === 'rejected' && (
          <TextField
            value={comment}
            variant="outlined"
            label="Especifica el motivo"
            margin="dense"
            onChange={e => setComment(e.target.value)}
            helperText={!comment ? 'Este campo es obligatorio' : '* Required'}
            error={!comment}
            fullWidth
            // autoFocus
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleAccept} color="primary">
          {status === 'rejected' && 'Rechazar'}
          {status === 'approved' && 'Aprobar'}
          {status === 'delivered' && 'Manilla Entregada'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmChangeStatus;