import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
// import CodeIcon from "@material-ui/icons/Code";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
// import DashboardIcon from "@material-ui/icons/Dashboard";
import { Link } from "react-router-dom";

const categories = [{
  children: [
    { id: "Registros", icon: <FormatListBulletedIcon />, to: "/registered", active: false },
    // { id: "Códigos", icon: <CodeIcon />, to: "/codes", active: false },
    { id: "Precio del día", icon: <AttachMoneyIcon />, to: "/rateday", active: false },
    // { id: "Totalizados", icon: <DashboardIcon />, to: "/stats", active: false }
  ],
  id: 'firtsChildren'
}];

const styles = theme => ({
  categoryHeader: {
    paddingTop: 16,
    paddingBottom: 16
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white
  },
  item: {
    paddingTop: 4,
    paddingBottom: 4,
    color: "rgba(255, 255, 255, 0.7)"
  },
  itemCategory: {
    backgroundColor: "#232f3e",
    boxShadow: "0 -1px 0 #404854 inset",
    paddingTop: 16,
    paddingBottom: 16
  },
  firebase: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.common.white
  },
  itemActionable: {
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)"
    }
  },
  itemActiveItem: {
    color: "#4fc3f7"
  },
  itemPrimary: {
    color: "inherit",
    fontSize: theme.typography.fontSize,
    "&$textDense": {
      fontSize: theme.typography.fontSize
    }
  },
  link: {
    textDecoration: "none"
  },
  divider: {
    marginTop: theme.spacing(2)
  }
});

function Navigator(props) {
  const { classes, ...other } = props;

  categories[0].children.forEach(cat => cat.active = window.location.pathname === cat.to);

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem
          className={classNames(
            classes.firebase,
            classes.item,
            classes.itemCategory
          )}
        >
          INSPIRATED
        </ListItem>
        {categories.map(({ id, children }) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary
                }}
              >
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, to, active }) => (
              <Link to={to} className={classes.link} key={childId}>
                <ListItem
                  button
                  dense
                  className={classNames(
                    classes.item,
                    classes.itemActionable,
                    active && classes.itemActiveItem
                  )}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText
                    classes={{
                      primary: classes.itemPrimary,
                      // textDense: classes.textDense
                    }}
                  >
                    {childId}
                  </ListItemText>
                </ListItem>
              </Link>
            ))}
            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Navigator);
