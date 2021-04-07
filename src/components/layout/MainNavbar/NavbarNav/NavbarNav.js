import React from "react";
import { Nav, NavbarBrand } from "shards-react";
import logo from "../../../../images/mfd/img-logo-BIM.png";

export default () => (
  <Nav navbar className="border-left flex-row">
    <NavbarBrand
      className="w-100 mr-0"
      href="/about-us"
      style={{ lineHeight: "25px" }}
    >
      <div className="d-table m-auto">
        <img
          className="d-inline-block align-top mr-1"
          style={{ maxWidth: "40px" }}
          src={logo}
          alt="MyBIM Logo"
        />
      </div>
    </NavbarBrand>
  </Nav>
);
