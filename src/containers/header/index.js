import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Tooltip,
  Avatar,
  Grid,
  Hidden,
  IconButton,
  Toolbar,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { AuthContext } from "../../context/auth";
import MenuIcon from "@material-ui/icons/Menu";
import imgDefaultUser from "../../assets/img/imgDefaultUser.jpg";

const lightColor = "rgba(255, 255, 255, 0.7)";

const styles = theme => ({
  header: {
    height: '60px',
  },
  toolbar: {
    padding: '0 !important',
    height: '100%',
  },
  secondaryBar: {
    zIndex: 0
  },
  container: {
    height: '100%',
    width: '100%',
    margin: 0,
    padding: '0 20px',
    [theme.breakpoints.only('xs')]: {
      justifyContent: 'space-between',
      padding: '0 10px',
    },
    [theme.breakpoints.only('sm')]: {
      justifyContent: 'flex-end',
    }
  },
  noPadding: {
    padding: '0 !important',
  },
  menuButton: {
    marginLeft: -theme.spacing(1),
  },
  iconButtonAvatar: {
    padding: 4
  },
  userName: {
    color: theme.palette.common.white,
    [theme.breakpoints.up('sm')]: {
      marginRight: '15px',
    }
  },
  link: {
    textDecoration: "none",
    color: lightColor,
    "&:hover": {
      color: theme.palette.common.white
    }
  },
  button: {
    borderColor: lightColor
  }
});

class Header extends Component {

  render() {

    const { classes, onDrawerToggle } = this.props;
    const { user, logOut } = this.context;

    return (
      <React.Fragment>
        <AppBar className={classes.header} color="primary" position="sticky" elevation={0}>
          <Toolbar className={classes.toolbar}>
            <Grid className={classes.container} container spacing={8} alignItems="center">
              <Hidden smUp>
                <Grid className={classes.noPadding} item>
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={onDrawerToggle}
                    className={classes.menuButton}
                  >
                    <MenuIcon />
                  </IconButton>
                </Grid>
              </Hidden>
              <Hidden smDown>
                <Grid item xs />
              </Hidden>
              <Grid className={classes.noPadding} item>
                <Typography className={classes.userName}>
                  {user && (user.displayName || user.email)}
                </Typography>
              </Grid>
              <Grid className={classes.noPadding} item>
                
                <IconButton color="inherit" onClick={logOut} className={classes.iconButtonAvatar}>
                  <Tooltip title="Cerrar sesión">
                    <Avatar
                      className={classes.avatar}
                      src={imgDefaultUser}
                    />
                  </Tooltip>
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}

Header.contextType = AuthContext;

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired
};

export default withStyles(styles)(Header);
