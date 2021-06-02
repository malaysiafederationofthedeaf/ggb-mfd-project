import React from "react";
import classNames from "classnames";
import { Col } from "shards-react";

import SidebarCategoryItems from "./SidebarCategoryItems";

class SidebarCategory extends React.Component {
  render() {
    const classes = classNames("main-sidebar", "px-0", "col-12");
    return (
      <Col tag="aside" className={classes}>
        <SidebarCategoryItems param={this.props.urlParam} />
      </Col>
    );
  }
}

export default SidebarCategory;
