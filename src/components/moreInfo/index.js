import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Dialog, Button, IconButton } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import PictureModal from '../pictureModal';

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

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
  container: {
    width: '100%',
  },
  textAdmin: {
    textAlign: 'center',
  }
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

function MoreInfo(props) {
  const { onClose, open, selected, classes, handleCancel, handleAccept, handleDelivered } = props;

  if (!selected)
    return <div></div>;

  // console.log("Selected: ", selected);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={true}
      aria-labelledby="customized-dialog-title"
    >
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        Datos de la inscripción
      </DialogTitle>
      <DialogContent dividers>
        <Typography className={classes.textAdmin} variant="h6">
          <b>Datos personales</b>
        </Typography>
        <Typography gutterBottom>
          <b>Nombre: </b> {selected.firstName} {selected.lastName}
        </Typography>
        <Typography gutterBottom>
          <b>Edad: </b> {selected.age}
        </Typography>
        <Typography gutterBottom>
          <b>Teléfono: </b> {selected.phoneNumber}
        </Typography>
        <Typography gutterBottom>
          <b>Email: </b> {selected.email}
        </Typography>
        <Typography gutterBottom>
          <b>Empresa: </b> {selected.company}
        </Typography>
        <Typography gutterBottom>
          <b>Cargo: </b> {selected.position}
        </Typography>
        {
          selected.status === 'approved' && selected.code &&
          <>
            <Typography gutterBottom>
              <b>Código: </b> {selected.code}
            </Typography>
          </>
        }
        {
          selected.status === 'rejected' && selected.comment &&
          <>
            <Typography gutterBottom>
              <b>Comentario: </b> {selected.comment}
            </Typography>
          </>
        }
        <Typography className={classes.textAdmin} variant="h6">
          <b>Pago</b>
        </Typography>
        <Typography gutterBottom>
          <b>Método de pago: </b> {selected.payment.method}
        </Typography>
        <Typography gutterBottom>
          <b>Banco emisor: </b> {selected.payment.bank}
        </Typography>
        <Typography gutterBottom>
          <b>Referencia: </b> {selected.payment.reference}
        </Typography>
        {
          selected.payment.fileURL &&
          <>
            <Typography gutterBottom>
              <b>Capture de transferencia: </b> <PictureModal fileURL={selected.payment.fileURL} />
            </Typography>
          </>
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Salir
        </Button>
        {selected.status === 'waiting' && (
          <>
            <Button onClick={handleCancel} color="primary">
              Rechazar
            </Button>
            <Button onClick={handleAccept} color="primary">
              Aprobar
            </Button>
          </>
        )}
        {(selected.status === 'approved' && !selected.delivered) && (
          <Button onClick={handleDelivered} color="primary">
            Manilla Entregada
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default withStyles(styles)(MoreInfo);