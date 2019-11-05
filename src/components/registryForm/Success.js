import React from 'react';
import { makeStyles, Grid, Typography, Button } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  info: {
    textAlign: 'center',
    paddingTop: theme.spacing(2)
  },
  icon: {
    fontSize: 100,
    color: '#28a745'
  },
  link: {
    textDecoration: 'none'
  }
}));

function Success(props) {

  const classes = useStyles();
  // const { firstName, lastName, email } = props.values;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className={classes.info}>
          <CheckCircleOutlineIcon className={classes.icon} />
          <Typography variant="h5">
            Su registro ha sido procesado exitosamente.
          </Typography>
          <br />
          <Typography align="left" variant="subtitle1">
            Podrá retirar su manilla el día del evento.
          </Typography>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Link to={`/`} className={classes.link}>
          <Button 
            color="primary"
            variant="contained"
            fullWidth
            className={classes.button}
          >
            Volver a la pagina inicial
          </Button>
        </Link>
      </Grid>
    </Grid>
  );
}

export default Success;