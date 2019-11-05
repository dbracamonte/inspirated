import React from 'react';
import { makeStyles, Typography, Button } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center'
  },
  icon: {
    fontSize: 100,
    color: '#28a745'
  },
  link: {
    textDecoration: 'none'
  },
  button: {
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`
  },
}));

function Success(props) {

  const classes = useStyles();
  const { firstName, lastName, email } = props.values;

  return (
    <div className={classes.root}>
      <CheckCircleOutlineIcon className={classes.icon} />
      <Typography variant="h5">
        Su registro ha sido procesado exitosamente.
      </Typography>
      <br />
      <Typography variant="subtitle1">
        Estimado/a <b>{firstName} {lastName}</b>, a través del correo eletrónico <b>{email}</b> estará recibiendo el feedback del progreso de la inscripción.
      </Typography>
      <br />
      <Typography align="left" variant="subtitle1">
        <b>Nota:</b> Horario de atención para la entrega de manillas y recepción de pago en efectivo.
        <br />
        <br />
        <b>Lunes, Jueves y Viernes.</b> 08:00 A.M a 12:00 P.M <i>Dirigirce a: Ps. Jorge Romo o Hna. Elsa Orellana</i>
        <br />
        <br />
        <b>Martes y Miércoles.</b> 01:00 P.M a 05:00 P.M <i>Dirigirce a: Ps. Jorge Romo o Hna. Elsa Orellana</i>
        <br />
        <br />
        <b>Domingos.</b> 12:00 P.M a 03:00 P.M <i>Dirigirce únicamente a: Hna. Elsa Orellana</i>
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

export default Success;