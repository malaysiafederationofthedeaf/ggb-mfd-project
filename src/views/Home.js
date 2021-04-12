import React from "react";
import { useState, useEffect } from "react";

import { Container, Col, Row } from "shards-react";

import AboutUsPreview from "../components/about-us/AboutUsPreview";
import categoriesItems from "../data/categories/categories-items";
import CategoryList from "../components/category-vocabs/CategoryList";
import SignList from "../components/SignList";
import { Store } from "../flux";
import CategoryPreview from "../components/category-vocabs/CategoryPreview";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState(Store.getSearchTerm());
  const [searchState, setSearchState] = useState(Store.getSearchState());
  useEffect(() => {
    Store.addChangeListener(onChange);
    return () => Store.removeChangeListener(onChange);
  }, []);

  const onChange = () => {
    setSearchTerm(Store.getSearchTerm());
    setSearchState(Store.getSearchState());
  };

  return (
    <Container fluid className="main-content-container px-4 mb-2">
      {/* Search Lists */}
      {searchState ? (
        <SignList filter={searchTerm} />
      ) : (
        <>
          <Row>
            <Col lg="6" md="12" sm="12" className="mb-4">
              <AboutUsPreview />
            </Col>
            <Col lg="6" md="12" sm="12" className="mb-4">
              <CategoryPreview />
            </Col>
          </Row>

          {/* Signs Blocks */}
          {categoriesItems.slice(0, 2).map((category, key) => (
            <CategoryList category={category} key={key} />
          ))}
        </>
      )}
    </Container>
  );
};

export default Home;
