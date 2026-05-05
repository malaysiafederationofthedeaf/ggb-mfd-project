import React from "react";

import NavbarNavItem from "./NavbarNavItem";
import { Store } from "../../../flux";

class NavbarNavItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navItems: Store.getMainNavItems(),
    };
  }

  render() {
    const { navItems: items } = this.state;
    const { closeNavbar } = this.props;

    return (
      <>
        {
          items.map((item) => (
            <NavbarNavItem key={item.to || item.title} item={item} closeNavbar={closeNavbar}/>
          ))
        }
      </>
    );
  }
}

export default NavbarNavItems;
