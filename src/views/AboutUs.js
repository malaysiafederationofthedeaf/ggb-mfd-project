import React from "react";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "shards-react";
import { useTranslation } from "react-i18next";

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
    Store.addChangeListener(onChange);
    return () => Store.removeChangeListener(onChange);
  }, []);

  const onChange = () => {
    setSearchTerm(Store.getSearchTerm());
    setSearchState(Store.getSearchState());
  };

  const { t } = useTranslation();
  return (
    <Container fluid className="main-content-container px-4">
      {/* Search Lists */}
      {searchState ? (
        <SignList filter={searchTerm} />
      ) : (
        <AboutUsDetails t={t} />
      )}
    </Container>
  );
};

export default AboutUs;
