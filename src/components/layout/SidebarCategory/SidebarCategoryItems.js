import React from "react";
import { Nav } from "shards-react";

import { Store } from "../../../flux";
import SidebarCategoryItem from "./SidebarCategoryItem";

class SidebarCategoryItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      vocabsItems: Store.getGroups(),
      alphabets: Store.getAlphabetsList(),
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    Store.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    Store.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      vocabsItems: Store.getGroups(),
      alphabets: Store.getAlphabetsList(),
    });
  }

  render() {
    const { vocabsItems: items, alphabets: alphas } = this.state;
    return (
      <div className="sidebar-category m-0">
        {!this.props.param
          ? items.map((item, key) => (
              <ul key={key}>
                <SidebarCategoryItem item={item} />
              </ul>
            ))
          : alphas.map((alpha, key) => (
            <ul key={key}>
              <SidebarCategoryItem alpha={alpha} param={this.props.param} />
            </ul>
          ))
        }
      </div>
    );
  }
}

export default SidebarCategoryItems;
