import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { Tooltip, Fab } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  fab: {
    margin: theme.spacing(2),
  },
  absolute: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

function ExportIcon(props) {
  const classes = useStyles();
  const { handleExportCSV } = props;

  return (
    <>
      <Tooltip title="Download CSV" aria-label="Download CSV">
        <Fab color="primary" className={classes.absolute} onClick={handleExportCSV} >
          <CloudDownloadIcon />
        </Fab>
      </Tooltip>
    </>
  );
}


export default ExportIcon;