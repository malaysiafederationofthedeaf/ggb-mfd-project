import React from "react";
import PropTypes from "prop-types";
import { NavLink as RouteNavLink } from "react-router-dom";
import { NavItem, NavLink } from "shards-react";
import { useTranslation } from "react-i18next";

const NavbarNavItem = ({ item }) => {
  const { t } = useTranslation();
  return (
    <NavItem className="navbar-menu-item">
      <NavLink tag={(props) => <RouteNavLink {...props} />} to={item.to}>
        {t(item.title) && <span>{t(item.title)}</span>}
      </NavLink>
    </NavItem>
  );
};

NavbarNavItem.propTypes = {
  /**
   * The item object.
   */
  item: PropTypes.object,
};

export default NavbarNavItem;
