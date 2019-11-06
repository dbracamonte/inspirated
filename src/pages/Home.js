import React from "react";
import { makeStyles, CssBaseline, Grid, Button, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import bgLgImage from '../assets/img/main-bg-lg.jpg';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
    backgroundImage: `url(${bgLgImage})`,
    backgroundPosition: 'right',
    backgroundSize: 'cover',
    backgroundColor: '#000',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    flexGrow: 1,
    [theme.breakpoints.up('sm')]: {
      backgroundPosition: 'center',
    },
  },
  grid: {
    textAlign: 'center',
    alignSelf: 'center'
  },
  content: {
    margin: theme.spacing(4)
  },
  primaryText: {
    color: '#FFF',
    fontWeight: 500
  },
  secundaryText: {
    color: '#FFF',
  },
  alternativeText: {
    color: '#E9C419',
    fontWeight: 500
  },
  link: {
    textDecoration: 'none',
    color: '#FFF'
  },
  button: {
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`
  },
}));

function HomePage() {

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Grid container>
        <Grid item xs={12} sm={6}></Grid>
        <Grid item xs={12} sm={6} className={classes.grid}>
          <div className={classes.content}>
            <Typography variant="h2" className={classes.primaryText}>
              Darío Isea
            </Typography>
            <Typography variant="subtitle1" className={classes.secundaryText}>
              Speaker / Psicólogo
            </Typography>
            <Typography variant="subtitle2">
              <a href="https://www.instagram.com/dario.isea" target='_blank' className={classes.link}>
                @DARIO.ISEA
              </a>
            </Typography>
            <br />
            <Typography variant="h3" className={classes.alternativeText}>
              23 NOVIEMBRE
            </Typography>
            <br />
            <Typography variant="subtitle1" className={classes.secundaryText}>
              SALÓN DE EVENTOS DEL
            </Typography>
            <Typography variant="h4" className={classes.primaryText}>
              HOTEL RENNAISSANCE
            </Typography>
            <Typography variant="h4" className={classes.alternativeText}>
              CARACAS
            </Typography>
            <br />
            <Link to={`/registry`} className={classes.link}>
              <Button variant="contained" className={classes.button}>
                Registro
              </Button>
            </Link>
          </div>
        </Grid>
      </Grid>
    </div>
  );

}

export default HomePage;
