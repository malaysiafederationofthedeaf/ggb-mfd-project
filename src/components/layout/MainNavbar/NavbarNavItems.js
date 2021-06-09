import React from "react";

import NavbarNavItem from "./NavbarNavItem";
import { Store } from "../../../flux";

class NavbarNavItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navItems: Store.getSidebarItems(),
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
