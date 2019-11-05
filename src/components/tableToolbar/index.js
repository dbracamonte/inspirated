import React from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
// import CheckIcon from '@material-ui/icons/Check';
// import CancelIcon from '@material-ui/icons/Cancel';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import SearchIcon from '@material-ui/icons/Search';
// import CloseIcon from '@material-ui/icons/Close';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing(3),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
    width: '100%',
    textAlign: 'right',
  },
  title: {
    flex: '0 0 auto',
  },
  options: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  searchInput: {
    width: '50%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    }
  },
});

let TableToolbar = props => {
  const { selected, title, classes, onClick, handleFilter } = props; // dataSelected

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: selected || false,
      })}
    >
      <div className={classes.title}>
        {selected ? (
          <Typography color="inherit" variant="subtitle1">
            Opciones
          </Typography>
        ) : (
            <Typography variant="h6" id="tableTitle">
              {title}
            </Typography>
          )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {selected ? (
          <div className={classes.options}>
            <Tooltip title="Ver más info">
              <IconButton aria-label="Ver más info" onClick={() => onClick("more-info")}>
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
            {/* {dataSelected.status === 'waiting' && (
              <>
                <Tooltip title="Marcar como Rechazada">
                  <IconButton aria-label="Marcar como Rechazada" onClick={() => onClick("rejected")}>
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Marcar como Aprovada">
                  <IconButton aria-label="Marcar como Aprovada" onClick={() => onClick("approved")}>
                    <CheckIcon />
                  </IconButton>
                </Tooltip>
              </>
            )} */}
          </div>
        ) : (
            <TextField
              id="simple-start-adornment"
              placeholder="Buscar"
              onInput={handleFilter}
              fullWidth
              className={classes.searchInput}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                // endAdornment: <InputAdornment position="end"><CloseIcon className={classes.closeSearchIcon} /></InputAdornment>,
              }}
            />
          )}
      </div>
    </Toolbar>
  );
};

TableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  selected: PropTypes.number.isRequired,
};

export default TableToolbar = withStyles(toolbarStyles)(TableToolbar);
