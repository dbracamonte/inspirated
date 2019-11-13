import React from "react";
import {
  makeStyles,
  Paper,
  Toolbar,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button
} from "@material-ui/core";

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
  link: {
    textDecoration: 'none'
  }
}));

function Summary(props) {

  const classes = useStyles();
  const { values, handleConfirm, handleBack } = props;
  const { firstName, lastName, age, email, phoneNumber, company, position, paymentMethod, bank, reference, fileURL } = values;

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Paper className={classes.root}>
          <Toolbar className={classes.toolbar}>
            <div className={classes.title}>
              <Typography variant="h6">
                Resumen
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
              <TableRow> {/* key={age} */}
                <TableCell>Edad</TableCell>
                <TableCell>{age}</TableCell>
              </TableRow>
              <TableRow> {/* key={email} */}
                <TableCell>Correo electrónico</TableCell>
                <TableCell>{email}</TableCell>
              </TableRow>
              <TableRow> {/* key={phoneNumber} */}
                <TableCell>Número telefónico</TableCell>
                <TableCell>{phoneNumber}</TableCell>
              </TableRow>
              <TableRow> {/* key={company} */}
                <TableCell>Empresa</TableCell>
                <TableCell>{company}</TableCell>
              </TableRow>
              <TableRow> {/* key={position} */}
                <TableCell>Cargo</TableCell>
                <TableCell>{position}</TableCell>
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
                Pago
              </Typography>
            </div>
          </Toolbar>
          <Table className={classes.table}>
            <TableBody>
              <TableRow> {/* key={paymentMethod} */}
                <TableCell>Referencia</TableCell>
                <TableCell>{paymentMethod}</TableCell>
              </TableRow>
              <TableRow> {/* key={bank} */}
                <TableCell>Banco emisor</TableCell>
                <TableCell>{bank}</TableCell>
              </TableRow>
              <TableRow> {/* key={reference} */}
                <TableCell>Referencia</TableCell>
                <TableCell>{reference}</TableCell>
              </TableRow>
              {
                fileURL &&
                <TableRow> {/* key={fileURL} */}
                  <TableCell>Imagen</TableCell>
                  <TableCell>
                    <a href={fileURL} target='_blank' rel="noopener noreferrer" className={classes.link}>
                      Ver
                    </a>
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Button
          color="primary"
          variant="contained"
          onClick={handleConfirm}
          // disabled={laoding}
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

export default Summary;