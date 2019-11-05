import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';
import { getRate, updateRegistered } from '../../services/firebase';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { green, orange } from '@material-ui/core/colors';
import { formatMoney } from '../../assets/utils';

const styles = theme => ({
  dateDay: {
    [theme.breakpoints.down('sm')]: {
      padding: '48px 36px 0',
    },
  },
  textHeaeder: {
    marginBottom: '2rem',
  },
  submit: {
    margin: '1rem 0 0 0',
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  textFeedbackSuccess: {
    color: green[500],
    marginTop: '1rem',
    fontWeight: 'bold',
  },
  textFeedbackError: {
    color: orange[700],
    marginTop: '1rem',
    fontWeight: 'bold',
  },
  textSubtitle: {
    margin: '1rem 0',
  }
});


class RateDay extends Component {
  state = {
    priceBS: 'loading',
    isSaved: '',
    priceUSD: 'loading',
    isSaving: false,
    isLoading: true,
  }

  componentWillMount() {
    getRate()
      .then(doc => {
        this.setState({ priceUSD: doc.data().usd, priceBS: doc.data().bs, isLoading: false, });
      }).catch(err => {
        console.error("Ocurrio un error al obtener el rate: ", err);
      })
  }

  handleChange = (e) => {
    this.setState({ priceBS: e.target.value * this.state.priceUSD });
  }

  handleSave = () => {
    const { priceBS } = this.state;

    this.setState({ isSaving: true, });
    updateRegistered('rate', 'rateDay', { bs: priceBS, })
      .then(() => {
        this.setState({ isSaved: 'saved', });
        setTimeout(() => this.setState({ isSaved: '=', }), 5000);
      })
      .catch(error => {
        console.log("Ocurrio un error al actualizar: ", error);
        this.setState({ isSaved: 'error', });
        setTimeout(() => this.setState({ isSaved: '=', }), 5000);
      })
      .finally(() => this.setState({ isSaving: false, }));
  }

  render() {
    const { classes } = this.props;
    const { priceUSD, priceBS, isLoading, isSaving, isSaved } = this.state;

    const priceInBs = !isLoading && priceUSD && priceBS ? priceBS / priceUSD : 0;

    return (
      <div className={classes.dateDay}>
        <Typography className={classes.textHeaeder} variant="h4">
          Establece el precio del Dolar ($), en Bolivares (BsS).
        </Typography>
        {!isLoading ?
          <>
            <Grid item xs={12}>
              <TextField
                id="priceInBs"
                name="priceInBs"
                type="number"
                label="Precio del Dolar"
                variant="outlined"
                onChange={this.handleChange}
                required
                autoFocus
                InputProps={{
                  startAdornment: <InputAdornment position="start">BsS</InputAdornment>,
                }}
                defaultValue={priceInBs}
              />
            </Grid>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              onClick={this.handleSave}
              disabled={isSaving}
              className={classes.submit}
            >
              Guardar Precio
            {isSaving && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Button>
            {isSaved === 'saved' &&
              <Typography className={classes.textFeedbackSuccess} variant="subtitle1">
                Su cambio se guardó correctamente
              </Typography>}
            {isSaved === 'error' &&
              <Typography className={classes.textFeedbackError} variant="subtitle1">
                Upss!! No se pudo guardar su cambio. Habla con soporte.
              </Typography>}
            <Typography className={classes.textSubtitle} variant="subtitle1">
              El precio de la entrada actual en <b>BsS.</b> es de {formatMoney(priceBS)} BsS.
            </Typography>
            <Typography className={classes.textSubtitle} variant="subtitle1">
              El precio de la entrada actual en <b>USD.</b> es de {priceUSD} $.
            </Typography>
          </>
          :
          <CircularProgress />}
      </div>
    )
  }
}

export default withStyles(styles)(RateDay);