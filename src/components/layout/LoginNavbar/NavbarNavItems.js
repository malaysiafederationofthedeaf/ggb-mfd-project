import React from "react";

import NavbarNavItem from "./NavbarNavItem";
import { Store } from "../../../flux3";

class NavbarNavItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navItems: Store.getMainNavItems(),
    };
  }

  render() {
    const { navItems: items } = this.state;
    return (
      <>
        {
          items.map((item, key) => (
            <NavbarNavItem key={key} item={item} />
          ))
        }
      </>
    );
  }
}

export default NavbarNavItems;
