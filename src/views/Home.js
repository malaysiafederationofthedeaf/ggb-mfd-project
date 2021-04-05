import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import AboutUs from "../components/blog/AboutUs";
import categoriesItems from "../data/categories/categories-items";
import CategoryList from "../components/category-vocabs/CategoryList";
import SignList from "../components/SignList";
import { Store } from "../flux";

const Home = ({ categoriesItems }) => {
  const [searchTerm, setSearchTerm] = useState(Store.getSearchTerm());
  const [searchState, setSearchState] = useState(Store.getSearchState());
  useEffect(() => {
    Store.addChangeListener(() => {
      setSearchTerm(Store.getSearchTerm());
      setSearchState(Store.getSearchState());
    });
  }, []);
  return (
    <Container fluid className="main-content-container px-4">
      {/* Search Lists */}
      {searchState ? (
        <SignList filter={searchTerm} />
      ) : (
        <>
          {/* Page Header */}
          <Row noGutters className="page-header py-4">
            <PageTitle
              title="SignBank"
              subtitle="GGB-MFD"
              className="text-sm-left mb-3"
            />
          </Row>

          <Row>
            {/* About Us */}
            <Col className="mb-4">
              <AboutUs title="About Us" />
            </Col>
          </Row>

          {/* Signs Blocks */}
          {categoriesItems.slice(0, 2).map((category) => (
            <CategoryList category={category} />
          ))}
        </>
      )}
    </Container>
  );
};

Home.propTypes = {
  /**
   * The small stats dataset.
   */
  categoriesItems: PropTypes.array,
};

Home.defaultProps = {
  categoriesItems,
};

export default Home;
