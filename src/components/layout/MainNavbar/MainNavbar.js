import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Container, Navbar } from "shards-react";

import SearchInput from "../../SearchInput";
import NavbarNav from "./NavbarNav/NavbarNav";
import NavbarToggle from "./NavbarToggle";

const MainNavbar = ({ layout, stickyTop, onChange, onFocus }) => {
  const classes = classNames(stickyTop && "sticky-top");

  return (
    <div className={classes}>
      <div className="main-navbar bg-white">
        <Container className="p-0">
          <Navbar
            type="light"
            className="align-items-stretch flex-md-nowrap p-0"
          >
            <NavbarNav />
            <NavbarToggle />
          </Navbar>
        </Container>
      </div>

      {/* Search Row */}
      <SearchInput onChange={onChange} onFocus={onFocus} />
    </div>
  );
};

MainNavbar.propTypes = {
  /**
   * The layout type where the MainNavbar is used.
   */
  layout: PropTypes.string,
  /**
   * Whether the main navbar is sticky to the top, or not.
   */
  stickyTop: PropTypes.bool,
};

MainNavbar.defaultProps = {
  stickyTop: true,
};

export default MainNavbar;
