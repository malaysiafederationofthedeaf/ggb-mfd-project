import React from "react";
import { Container } from "shards-react";

import categoriesItems from "../data/categories/categories-items";
import CategoryList from "../components/category-vocabs/CategoryList";

class BrowseByCategory extends React.Component {
  render() {
    return (
      <Container fluid className="main-content-container px-4 mb-2">
        {categoriesItems.map((category, key) => (
          <CategoryList category={category} key={key} />
        ))}
      </Container>
    );
  }
}

export default BrowseByCategory;
