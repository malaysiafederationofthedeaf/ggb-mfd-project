import React from "react";
import { Nav } from "shards-react";

import { Store } from "../../../flux";
import SidebarCategoryItem from "./SidebarCategoryItem";

class SidebarCategoryItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      vocabsItems: Store.getSidebarVocabItems(),
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
      vocabsItems: Store.getSidebarVocabItems(),
    });
  }

  render() {
    const { vocabsItems: items } = this.state;
    return (
      <div className="sidebar-category">
        <Nav className="nav--no-borders flex-column">
          {items.map((item, key) => (
            <ul key={key}>
              <SidebarCategoryItem item={item} />
            </ul>
          ))}
        </Nav>
      </div>
    );
  }
}

export default SidebarCategoryItems;
