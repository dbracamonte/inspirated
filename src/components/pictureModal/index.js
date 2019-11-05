import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    maxWidth: 600,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1),
    outline: 'none',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`
  },
  imgResponsive: {
    position: 'relative',
    maxWidth: '100%'
  }
}));

function PictureModal(props) {

  const { fileURL } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" size="small" onClick={handleOpen} className={classes.button}>
        Ver
      </Button>
      <Modal
        aria-labelledby="picture-modal-title"
        aria-describedby="picture-modal-description"
        open={open}
        onClose={handleClose}
        className={classes.modal}
      >
        <div className={classes.paper}>
          <img src={fileURL} className={classes.imgResponsive} alt="Ref" />
        </div>
      </Modal>
    </React.Fragment>
  );
}

export default PictureModal;
