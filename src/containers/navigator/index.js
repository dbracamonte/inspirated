import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import { Link } from "react-router-dom";
import logo from "../../assets/img/logo-inspirated-light.png";

const categories = [{
  children: [
    { id: "Registros", icon: <FormatListBulletedIcon />, to: "/registered", active: false },
    { id: "Precio del día", icon: <AttachMoneyIcon />, to: "/rateday", active: false },
  ],
  id: 'firtsChildren'
}];

const styles = theme => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
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
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  contentLogo: {
    padding: theme.spacing(2),
  },
  logo: {
    margin:'auto'
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
            classes.contentLogo,
            classes.item,
            classes.itemCategory
          )}
        >
          <img src={logo} alt='inspirated' width={130} className={classes.logo} />
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
