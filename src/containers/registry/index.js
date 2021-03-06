import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
  Container,
  Grid,
  Typography,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Button,
  CssBaseline
} from "@material-ui/core";
import Check from "@material-ui/icons/Check";
import RegistryForm from "../../components/registryForm";
import Success from "../../components/registryForm/Success";
import { getRate } from "../../services/firebase/api";
import logo from "../../assets/img/logo-inspirated.png";

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  active: {
    '& $line': {
      borderColor: '#784af4',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#784af4',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: '#784af4',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
};

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  root: {
    paddingTop: theme.spacing(1),
  },
  paper: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  button: {
    marginRight: theme.spacing(1),
  },
  textPrice: {
    textAlign: 'right'
  }
}));

function getSteps() {
  return ['Datos personales', 'Ayúdanos a conocerte', 'Pago', 'Resumen'];
}

export default function RegistryStepper() {
  const classes = useStyles();
  const [rates, setRates] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const fetchRates = async () => {
    getRate().then(doc => {
      setRates({
        rateDayBs: doc.data().bs,
        rateDayUSD: doc.data().usd
      });
    }).catch(error => {
      if (error.code === 'unavailable') {
        this.fetchRates();
        console.log("Trying again beacuse code unavailable");
      }
      console.error("Error fetching RateDay: ", error);
    });
  };

  useEffect(() => { fetchRates({}); }, []);

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => setActiveStep(0);

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      {activeStep === steps.length ? (
        <>
          <Success/>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                disabled={activeStep === 0}
                onClick={handleReset}
                className={classes.button}>
                Volver a comprar
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
          <div className={classes.paper}>
            <Grid item xs={12}>
              <img src={logo} alt='inspirated' width={200} />
            </Grid>
            <Stepper alternativeLabel className={classes.root} activeStep={activeStep} connector={<QontoConnector />}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography className={classes.textPrice} variant="subtitle1">
                  <b>Precio del día: </b>
                  <Chip label={`${rates.rateDayBs} Bs.`} variant="outlined" />
                </Typography>
              </Grid>
            </Grid>
            <RegistryForm step={activeStep} handleNext={handleNext} handleBack={handleBack} />
            {/* {activeStep !== steps.length - 1 &&
              <>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}>
                      Volver
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      Continuar
                    </Button>
                  </Grid>
                </Grid>
              </>
            } */}
          </div>
        )}
    </Container >
  );
} 
