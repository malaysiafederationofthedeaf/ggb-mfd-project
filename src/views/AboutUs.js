import React from "react";
import { useState, useEffect } from "react";

import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import AboutUsDetails from "../components/about-us/AboutUsDetails";
import categoriesItems from "../data/categories/categories-items";
import CategoryList from "../components/category-vocabs/CategoryList";
import SignList from "../components/SignList";
import { Store } from "../flux";

const AboutUs = () => {
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
          <Row noGutters className="page-header py-4">
            <PageTitle
              title="Pengenalan"
              subtitle="ABOUT US"
              md="12"
              className="ml-sm-auto mr-sm-auto"
            />
          </Row>
          <Row>
            <Col>
              <AboutUsDetails />
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

export default AboutUs;
