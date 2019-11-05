import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Paper,
  Radio,
  CircularProgress,
  Grid,
  FormControlLabel,
  Switch,
  TextField
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import TableHeader from '../tableHeader';
import TableToolbar from '../tableToolbar';
import MoreInfo from '../moreInfo';
import ConfirmChangeStatus from '../confirmChangeStatus'
import { onGetRegistered, updateRegistered } from '../../services/firebase/api';
import { formatMoney, JSONToCSVConvertor, statusTickets, statuses } from '../../assets/utils';
import ExportIcon from '../../components/exportIcon';

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
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

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginTop: 0,
    },
  },
  roorDates: {
    maxWidth: '100%',
    flexGrow: 1,
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
  },
  table: {
    minWidth: 720,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  tabs: {
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: '5px 0 10px 0',
    },
    display: 'flex',
    height: '40px',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    background: '#009be5',
    color: 'rgba(255, 255, 255, .7)',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  },
  tab: {
    width: '33.33%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '400',
    background: 'rgba(255, 255, 255, .1)',
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px'
    },
  },
  loading: {
    width: '100%',
    textAlign: 'center',
    marginTop: '3rem',
  }
});

const getCurrentDate = (separator = '', newDate) => {
  newDate = newDate ? new Date(newDate.replace(new RegExp('-', 'gi'), '/')) : new Date();

  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`;
};

class TableRegistered extends React.Component {
  state = {
    tab: 0,
    page: 0,
    open: false,
    data: [],
    order: 'asc',
    modal: '',
    filter: '',
    orderBy: 'date',
    selected: '',
    isLoading: true,
    finalDate: getCurrentDate('-'),
    rowsPerPage: 20,
    openMoreInfo: false,
    filterByDates: false,
    initialDate: '2019-01-01',
  };

  componentWillMount() {
    onGetRegistered('registered', data => {
      const registered = data.docs.map(doc => {
        const { firstName, lastName, age, identity, ...other } = doc.data();
        return {
          id: doc.id,
          firstName,
          lastName,
          age,
          identity,
          ...other
        }
      });

      this.setState({ data: registered, isLoading: false });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.tab !== this.state.tab && this.state.selected) {
      this.setState({ selected: '' });
    }
  }

  handleChangeDates = e => {
    // console.log(`handleChangeDates ${e.target.name} ${e.target.value}`);
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCheckChange = e => this.setState({ [e.target.name]: e.target.checked });

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: '' });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    // const selectedIndex = selected.indexOf(id);
    // let newSelected = id;

    // if (selectedIndex === -1) {
    //   newSelected = newSelected.concat(selected, id);
    // } else if (selectedIndex === 0) {
    //   newSelected = newSelected.concat(selected.slice(1));
    // } else if (selectedIndex === selected.length - 1) {
    //   newSelected = newSelected.concat(selected.slice(0, -1));
    // } else if (selectedIndex > 0) {
    //   newSelected = newSelected.concat(
    //     selected.slice(0, selectedIndex),
    //     selected.slice(selectedIndex + 1),
    //   );
    // }

    this.setState({ selected: selected === id ? '' : id });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleClickBtnTool = (action) => {
    if (action === 'more-info') {
      this.setState({ openMoreInfo: true, });
    }
  };

  handleCloseDialog = (accept, comment) => {
    this.setState({ open: false, modal: '', selected: '', });

    const { selected, data, modal } = this.state;
    const dataSelected = data.find(({ id }) => selected === id);

    if (accept === 'approvedChangeStatus') {
      updateRegistered('registered', dataSelected.id, { status: modal, comment });
    } else if (accept === 'approvedChangeToDelivered') {
      updateRegistered('registered', dataSelected.id, { delivered: true });
    }
  }

  getFilteredRows = () => {
    const { data, tab, filterByDates, initialDate, finalDate } = this.state;
    const filter = this.state.filter.toLowerCase();
    let filteredData = [];


    // Primer filtro por tab
    filteredData = data.filter(({ status }) => status === statuses[tab]);
    // Segundo filtro por busqueda
    filteredData = filteredData.filter(({ firstName, lastName, date, age, identity }) => {
      if (
        `${firstName} ${lastName}`.toLowerCase().includes(filter) ||
        date.toLowerCase().includes(filter) ||
        age.toString().includes(filter) ||
        identity.toLowerCase().includes(filter)
      ) {
        return true;
      } else {
        return false;
      }
    });

    // Filtro por fechas
    if (filterByDates) {
      if (initialDate > finalDate) {
        console.warn('initialDate no puede ser mayor a finalDate');
      } else {
        const initialDateFormat = getCurrentDate('-', initialDate);
        const finalDateFormat = getCurrentDate('-', finalDate);

        // console.log({ initialDateFormat }, { finalDateFormat });

        filteredData = filteredData.filter(item => {
          const validation =
            new Date(getCurrentDate('-', item.date)).getTime() >= new Date(initialDateFormat).getTime() &&
            new Date(getCurrentDate('-', item.date)).getTime() <= new Date(finalDateFormat).getTime();

          return validation;
        });
      }
    }

    return filteredData;
  }

  isSelected = id => this.state.selected === id;

  handleFilter = e => {
    this.setState({ filter: e.target.value, page: 0, });
  }

  handleExportCSV = () => {

    // const csvRow = [];
    // const JSONData = [['Id', 'Responsable', 'Correo', 'Entradas', 'Metodo', 'Fecha', 'Monto', 'Referencia', 'Banco Emisor', 'Banco Receptor', 'Estado', 'Tipo']]; // 'Estatus'
    // const data = this.getFilteredRows();

    // for (let item = 0; item < data.length; item++) {
    //   JSONData.push([
    //     item + 1,
    //     `${data[item].responsable.firstName} ${data[item].responsable.lastName}`,
    //     data[item].responsable.email,
    //     data[item].tickets,
    //     data[item].type,
    //     data[item].date,
    //     data[item].amount,
    //     `${data[item].type === 'transfer' ? data[item].ref : 'No Aplica'}`,
    //     `${data[item].type === 'transfer' ? data[item].issuingBank : 'No Aplica'}`,
    //     `${data[item].type === 'transfer' ? data[item].receivingBank : 'No Aplica'}`,
    //     // data[item].status,
    //     `${data[item].delivered ? 'Entregadas' : 'Por Retirar'}`,
    //     `${data[item].codePlatea ? 'Platea' : ''} ${data[item].codeTickets ? '+5 Entradas' : ''} ${!data[item].codePlatea && !data[item].codeTickets ? 'Normal' : ''}`
    //   ])
    // }

    const JSONData = [['#', 'Pastor de 12 Nacional', 'Nombre de la Iglesia', 'Pastor de su Iglesia', 'Red', 'Estado', 'Tipo']];
    const data = this.getFilteredRows();

    let counter = 0;

    for (let i = 0; i < data.length; i++) {
      const users = data[i].users;

      for (let u = 0; u < users.length; u++) {
        counter++;

        JSONData.push([
          counter, // u + 1
          users[u].userPastor,
          users[u].userChurchName,
          users[u].userPastorChurch !== 'Otro' ? users[u].userPastorChurch : ` - ${users[u].userOtherPastor}`,
          users[u].userNet,
          `${data[i].status === 'approved' ? data[i].delivered ? 'Entregadas' : 'Por Retirar' : data[i].status === 'waiting' ? 'En Espera' : 'Cancelada'}`,
          `${data[i].codePlatea ? 'Platea' : 'Gradas'}`,
        ])
      }
    }

    console.log("JSONData: ", JSONData);

    JSONToCSVConvertor(JSONData, `Inscripciones en status de ${statusTickets[statuses[this.state.tab]]}`, false);
  }

  getRows = () => {
    const { tab } = this.state;

    let rows = [
      { id: 'name', numeric: false, disablePadding: false, label: 'Nombre', show: true, },
      { id: 'identity', numeric: false, disablePadding: false, label: 'C.I.', show: true, },
      { id: 'date', numeric: false, disablePadding: false, label: 'Fecha', show: true, },
    ];

    if (tab === 1) {
      rows = [
        { id: 'name', numeric: false, disablePadding: false, label: 'Nombre', show: true, },
        { id: 'identity', numeric: false, disablePadding: false, label: 'C.I.', show: true, },
        { id: 'date', numeric: false, disablePadding: false, label: 'Fecha', show: true, },
      ];
    }

    rows = rows.filter(({ show }) => show);

    return rows;
  }

  render() {
    const { classes } = this.props;
    const { order, orderBy, selected, rowsPerPage, page, open, modal, openMoreInfo, tab, isLoading, filterByDates, initialDate, finalDate } = this.state;
    const data = this.getFilteredRows();
    // const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    const dataSelected = data.find(({ id }) => selected === id);

    let rows = this.getRows();
    console.log('STATE', this.state);

    return (
      <>
        <div className={classes.tabs}>
          <div
            style={tab === 0 ? { color: '#fff', background: 'transparent', userSelect: 'none' } : {}}
            onMouseDown={() => this.setState({ tab: 0 })}
            className={classes.tab}
          >
            EN PROCESO
            </div>
          <div
            style={tab === 1 ? { color: '#fff', background: 'transparent', userSelect: 'none' } : {}}
            onMouseDown={() => this.setState({ tab: 1 })}
            className={classes.tab}
          >
            APROBADAS
            </div>
          <div
            style={tab === 2 ? { color: '#fff', background: 'transparent', userSelect: 'none' } : {}}
            onMouseDown={() => this.setState({ tab: 2 })}
            className={classes.tab}
          >
            CANCELADAS
            </div>
        </div>

        <Grid container className={classes.roorDates} spacing={1}>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  name="filterByDates"
                  checked={filterByDates}
                  onChange={this.handleCheckChange}
                  color="primary"
                />
              }
              label="Filtrar por rango de fecha"
            />
          </Grid>
          {
            filterByDates &&
            <>
              <Grid item xs={6} md={4} lg={3}>
                <TextField
                  name="initialDate"
                  variant="outlined"
                  required
                  fullWidth
                  id="initialDate"
                  label="Fecha inicial"
                  type="date"
                  onChange={this.handleChangeDates}
                  defaultValue={initialDate}
                />
              </Grid>
              <Grid item xs={6} md={4} lg={3}>
                <TextField
                  name="finalDate"
                  variant="outlined"
                  required
                  fullWidth
                  id="finalDate"
                  label="Fecha final"
                  type="date"
                  onChange={this.handleChangeDates}
                  defaultValue={finalDate}
                />
              </Grid>
            </>
          }
        </Grid>

        {
          !isLoading && (
          <Paper className={classes.root}>
            <TableToolbar
              title="Lista de Inscripciones"
              onClick={this.handleClickBtnTool}
              // numSelected={selected.length}
              selected={selected ? 1 : 0}
              handleFilter={this.handleFilter}
              dataSelected={dataSelected || {}}
            />
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby="tableTitle">
                <TableHeader
                  rows={rows}
                  // numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={this.handleSelectAllClick}
                  onRequestSort={this.handleRequestSort}
                  rowCount={data.length}
                />
                <TableBody>
                  {
                    stableSort(data, getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(n => {
                      const isSelected = this.isSelected(n.id);
                      return (
                        <TableRow
                          hover
                          onClick={event => this.handleClick(event, n.id)}
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={n.id}
                          selected={isSelected}
                        >
                          <TableCell padding="checkbox">
                            {/* <Checkbox checked={isSelected} /> */}
                            <Radio checked={isSelected} />
                          </TableCell>
                          <TableCell>{n.firstName} {n.lastName}</TableCell>
                          <TableCell>{n.identity}</TableCell>
                          <TableCell>{n.date}</TableCell>
                        </TableRow>
                      );
                    })
                  }
                  {/* {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )} */}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              rowsPerPageOptions={[20]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
            <ConfirmChangeStatus
              open={open}
              status={modal}
              onClose={this.handleCloseDialog}
              dataSelected={dataSelected}
            />
            <MoreInfo
              open={openMoreInfo}
              onClose={() => this.setState({ openMoreInfo: false })}
              selected={dataSelected}
              handleCancel={() => this.setState({ modal: 'rejected', open: true, })}
              handleAccept={() => this.setState({ modal: 'approved', open: true, })}
              handleDelivered={() => this.setState({ modal: 'delivered', open: true, })}
            />
          </Paper>
        )}

        {
          isLoading &&
          <div className={classes.loading}>
            <CircularProgress />
          </div>
        }
        {/* <ExportIcon handleExportCSV={this.handleExportCSV} /> */}
      </>
    );
  }
}

TableRegistered.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableRegistered);