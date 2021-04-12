import React from "react";
import { Nav, NavbarBrand } from "shards-react";
import logo from "../../../../images/mfd/img-logo-BIM.png";
import NavbarBackButton from "../../../common/NavbarBackButton"

export default () => (
  <Nav navbar className="border-left flex-row">
    <NavbarBrand
      className="w-100 mr-0"
    >
      <div className="d-table m-auto">
        <NavbarBackButton />
        <img
          className="d-inline-block align-top mr-1 navbar-logo"
          src={logo}
          alt="BIM Logo"
        />
        <h3 className="d-inline-block align-top mr-1 app-name">BIM</h3>
      </div>
    </NavbarBrand>
  </Nav>
);
