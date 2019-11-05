import React from 'react';
import { makeStyles, Typography, Button } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center'
  },
  icon: {
    fontSize: 100,
    color: '#dc3545'
  },
  link: {
    marginTop: theme.spacing(4),
    textDecoration: 'none'
  },
  button: {
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`
  },
}));

function Error() {

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <HighlightOffIcon className={classes.icon} />
      <Typography variant="h5">
        En estos momentos no pudimos procesar su operación, por favor intente de nuevo.
      </Typography>
      <br />
      <Link to={`/`} className={classes.link}>
        <Button variant="contained" className={classes.button}>
          Atrás
        </Button>
      </Link>
    </div>
  );

}

export default Error;