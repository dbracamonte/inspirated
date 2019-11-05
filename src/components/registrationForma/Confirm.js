import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { createRegistered, updateRegistered } from '../../services/firebase/api';
import { makeStyles, Paper, Toolbar, Table, TableBody, TableRow, TableCell, Typography } from '@material-ui/core';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import PictureModal from '../pictureModal';
import { formatMoney } from '../../assets/utils';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  table: {
    minWidth: 320,
  },
}));

function Confirm(props) {

  const classes = useStyles();
  const { values, nextStep, prevStep } = props;
  const [laoding, setLoading] = useState(false);
  const { applyCode, applyCodePlatea, code, codePlatea, codeData, codeDataPlatea, paymentMethodType, paymentAmount, paymentDate, paymentRef, issuingBank, receivingBank, fileURL, tickets, firstName, lastName, email, identity, phoneNumber, users } = values;

  const handleConfirm = e => {
    e.preventDefault();

    setLoading(true);

    createRegistered("registered", {
      responsable: {
        firstName,
        lastName,
        email,
        identity,
        phoneNumber
      },
      paymentMethod: {
        type: paymentMethodType,
        amount: paymentAmount,
        date: paymentDate,
        ref: paymentRef,
        issuingBank,
        receivingBank,
        fileURL
      },
      tickets,
      users,
      code: null,
      specialPromo: '3x2',
      codeTickets: applyCode ? code : null,
      codePlatea: applyCodePlatea ? codePlatea : null,
      status: "waiting"
    })
      .then(async () => {
        if (applyCode && code && codeData.id) {
          await updateRegistered('codes', codeData.id, { status: 'used', });
        }

        if (applyCodePlatea && codePlatea && codeDataPlatea.id) {
          await updateRegistered('codes', codeDataPlatea.id, { status: 'used', });
        }

        setLoading(false);

        nextStep();
      })
      .catch(error => {
        nextStep();
        console.error("Error adding document: ", error);
      });

  };

  const handleBack = e => {
    e.preventDefault();
    prevStep();
  };

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Paper className={classes.root}>
          <Toolbar className={classes.toolbar}>
            <div className={classes.title}>
              <Typography variant="h6">
                Método de pago
              </Typography>
            </div>
            <div className={classes.title}>
              <Typography variant="h6">
                <BookmarksIcon /> {tickets}
              </Typography>
            </div>
          </Toolbar>
          <Table className={classes.table}>
            <TableBody>
              <TableRow> {/* key={paymentMethodType} */}
                <TableCell>Método de pago</TableCell>
                <TableCell>{paymentMethodType === 'transfer' ? 'Transferencia' : 'Efectivo'}</TableCell>
              </TableRow>
              <TableRow> {/* key={paymentAmount} */}
                <TableCell>Monto pagado</TableCell>
                <TableCell>{formatMoney(paymentAmount)} {paymentMethodType === 'transfer' ? 'BsS.' : '$'}</TableCell>
              </TableRow>
              <TableRow> {/* key={paymentDate} */}
                <TableCell>Fecha</TableCell>
                <TableCell>{paymentDate}</TableCell>
              </TableRow>
              {paymentRef &&
                <TableRow> {/* key={paymentRef} */}
                  <TableCell>Referencia</TableCell>
                  <TableCell>{paymentRef}</TableCell>
                </TableRow>}
              {issuingBank &&
                <TableRow> {/* key={issuingBank} */}
                  <TableCell>Banco emisor</TableCell>
                  <TableCell>{issuingBank}</TableCell>
                </TableRow>}
              {receivingBank &&
                <TableRow> {/* key={receivingBank} */}
                  <TableCell>Banco receptor</TableCell>
                  <TableCell>{receivingBank}</TableCell>
                </TableRow>}
              {fileURL &&
                <TableRow> {/* key={fileURL} */}
                  <TableCell>Captura de transferencia</TableCell>
                  <TableCell>
                    <PictureModal fileURL={fileURL} />
                  </TableCell>
                </TableRow>}
              <TableRow> {/* key={tickets} */}
                <TableCell>Cantidad de entradas</TableCell>
                <TableCell>{tickets}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.root}>
          <Toolbar className={classes.toolbar}>
            <div className={classes.title}>
              <Typography variant="h6">
                Responsable
              </Typography>
            </div>
          </Toolbar>
          <Table className={classes.table}>
            <TableBody>
              <TableRow> {/* key={firstName} */}
                <TableCell>Nombre</TableCell>
                <TableCell>{firstName}</TableCell>
              </TableRow>
              <TableRow> {/* key={lastName} */}
                <TableCell>Apellido</TableCell>
                <TableCell>{lastName}</TableCell>
              </TableRow>
              <TableRow> {/* key={identity} */}
                <TableCell>Cédula</TableCell>
                <TableCell>{identity}</TableCell>
              </TableRow>
              <TableRow> {/* key={email} */}
                <TableCell>Correo electrónico</TableCell>
                <TableCell>{email}</TableCell>
              </TableRow>
              <TableRow> {/* key={phoneNumber} */}
                <TableCell>Número telefónico</TableCell>
                <TableCell>{phoneNumber}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Button
          color="primary"
          variant="contained"
          onClick={handleConfirm}
          disabled={laoding}
          fullWidth
        >
          Confirmar
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleBack}
        >
          Atrás
        </Button>
      </Grid>
    </React.Fragment>
  );
}

export default Confirm;