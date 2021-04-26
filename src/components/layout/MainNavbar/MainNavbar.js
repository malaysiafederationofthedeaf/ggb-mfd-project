import React from "react";
import PropTypes from "prop-types";
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  Collapse
} from "shards-react";

import bimLogo from "../../../images/bim/logo/bim-logo.jpg";
import NavbarBackButton from "../../common/NavbarBackButton"
import NavbarNavItems from "./NavbarNavItems";
import NavbarTranslate from "./NavbarTranslate";
import SearchInput from "../../SearchInput";

class MainNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapseOpen: false
    };
  }

  toggleNavbar() {
    this.setState({
      ...this.state,
      ...{
        collapseOpen: !this.state.collapseOpen
      }
    });
  }

  render() {
    return (
      <Navbar type="light" expand="md" className="main-navbar">    
        {window.location.pathname !== "/home" && <NavbarBackButton />}
        <NavbarBrand href="/home">
            <img
            className="navbar-logo"
            src={bimLogo}
            alt="BIM Logo"
            /> 
        </NavbarBrand>
        <SearchInput onChange={this.props.onChange} onFocus={this.props.onFocus} />
        <NavbarTranslate toggle={this.props.toggle} /> 
        <NavbarToggler onClick={this.toggleNavbar} />  

        <Collapse open={this.state.collapseOpen} className="navbar-menu-items" navbar>
          <Nav navbar>
              <NavbarNavItems />                             
          </Nav>
            {!this.state.collapseOpen &&         
              <div className="navbar-right-logo">
                {this.props.linkDetails.map((link, key) => 
                  <a href={link.href} key={key}>
                    <img
                      src={link.imgSrc}
                      alt={link.imgAlt}
                    />         
                  </a>         
                )}               
              </div>  
            }           
        </Collapse>     
      </Navbar>
    );
  }
}


MainNavbar.propTypes = {
  /**
   * The about MFD preview object.
   */
   linkDetails: PropTypes.array,
};

MainNavbar.defaultProps = {
  linkDetails: [
    {
      href: "https://www.mymfdeaf.org/pengenalan",
      imgSrc: require("../../../images/mfd/mfd-logo.jpg"),
      imgAlt: "MFD Logo",
    },
    {
      href: "https://careers.guidewire.com/guidewire-gives-back",
      imgSrc: require("../../../images/ggb/ggb-logo.jpg"),
      imgAlt: "GGB Logo",
    },    
  ],
};

export default MainNavbar;