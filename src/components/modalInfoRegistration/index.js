import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MuiDialogActions from '@material-ui/core/DialogActions';

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
  button: {},
  titleSection: {
    fontSize: '1.2rem',
    borderBottom: '1px solid #ccc',
  },
  infoSectionSubTitle: {
    marginLeft: '8px',
    fontSize: '16px',
  },
  infoSection: {
    marginLeft: '18px',
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

function MoreInfo(props) {
  const { classes } = props;
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" size="small" onClick={handleOpen} className={classes.button}>
        Datos bancarios para transferencias.
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        aria-labelledby="customized-dialog-title"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Datos bancarios para transferencias.
        </DialogTitle>
        <DialogContent dividers>
          {/* <Typography component="div" className={classes.titleSection} gutterBottom>
            Información Bancaria
          </Typography> */}
          <Typography className={classes.infoSectionSubTitle} gutterBottom>
            BANCO. CARIBE
          </Typography>
          <Typography className={classes.infoSection} gutterBottom>
            <b>A nombre de:</b> Asociación civil misión carismática internacional
          </Typography>
          <Typography className={classes.infoSection} gutterBottom>
            <b>RIF:</b> J-297625739
          </Typography>
          <Typography className={classes.infoSection} gutterBottom>
            <b>Tipo de cuenta:</b> Corriente
          </Typography>
          <Typography className={classes.infoSection} gutterBottom>
            <b>Nº de cuenta:</b> 0114-0207-1920-7004-3737
          </Typography>

          {/* <br />

          <Typography className={classes.infoSectionSubTitle} gutterBottom>
            BANCO. BANESCO
          </Typography>
          <Typography className={classes.infoSection} gutterBottom>
            <b>A nombre de:</b> Latinoamericana N & R Company. C.A.
          </Typography>
          <Typography className={classes.infoSection} gutterBottom>
            <b>RIF:</b> J-296738963
          </Typography>
          <Typography className={classes.infoSection} gutterBottom>
            <b>Tipo de cuenta:</b> Corriente
          </Typography>
          <Typography className={classes.infoSection} gutterBottom>
            <b>Nº de cuenta:</b> 0134-0986-2798-6100-2561
          </Typography> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Salir
        </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default withStyles(styles)(MoreInfo);