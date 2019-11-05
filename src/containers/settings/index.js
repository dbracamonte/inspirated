import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { updateRegistered, getCodesRegistered } from '../../services/firebase'; // createRegistered
import InputAssignedDialog from './inputAssignedDialog';
import { AuthContext } from '../../context/auth';
import { statusCodes, typeReasedCode } from '../../assets/utils'; // randomString

const styles = theme => ({
  root: {
    width: '100%',
  },
  paper: {
    marginTop: theme.spacing(3),
    width: '100%',
    overflowX: 'auto',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginTop: '10px',
    },
  },
  table: {
    minWidth: 650,
  },
});

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

class Codes extends Component {
  state = {
    rows: [],
  };

  // componentDidMount() {
  //   const firstName = 'Dayana';
  //   const lastName = 'Morales';
  //   const id = '9FO1uyVCl5YIxZe0D6niMGTHyzm1';

  //   for (let i = 0; i < 100; i++) {
  //     const timeOutInsert = setTimeout(() => {
  //       createRegistered('codes', {
  //         code: `${firstName[0]}${lastName[0]}-${randomString(12)}`,
  //         owner: `${firstName} ${lastName}`,
  //         status: 'detained',
  //         assigned: '',
  //         ownerIdentity: id,
  //       });
  //       clearTimeout(timeOutInsert);
  //     }, 1000 * 2);
  //   }
  // }

  componentWillMount() {
    const { user } = this.context;

    getCodesRegistered(user.id, data => {
      const codes = data.docs.map(doc => {
        const code = doc.data();
        return {
          id: doc.id,
          ...code,
        }
      });

      this.setState({ rows: codes });
    });
  }

  enableCode = (idCode, assigned, type) => {
    updateRegistered('codes', idCode, { status: 'released', assigned, type });
  }

  render() {
    const { rows } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Asignado a</TableCell>
                <TableCell align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(rows, getSorting('desc', 'status')).map(row => {
                let status = row.status;
                if (status === 'detained') status = 'Desabilitado';
                else if (status === 'released') status = 'Habilitado';
                else if (status === 'used') status = 'Usado';

                return (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.code}
                    </TableCell>
                    <TableCell>{statusCodes[row.status]}</TableCell>
                    <TableCell>{row.assigned || 'Sin asignar'}</TableCell>
                    <TableCell align="center">
                      {row.status === 'detained' &&
                        <InputAssignedDialog onAccept={(assigned, type) => this.enableCode(row.id, assigned, type)} />}
                      {row.status !== 'detained' ? typeReasedCode[row.type] : null}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

Codes.contextType = AuthContext;

export default withStyles(styles)(Codes);