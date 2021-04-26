import React from "react";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "shards-react";
import { useTranslation } from "react-i18next";

import AboutUsPreview from "../components/about-us/AboutUsPreview";
import allVocabsItems from "../data/categories/all-vocabs-items";
import CategoryList from "../components/category-vocabs/CategoryList";
import SignList from "../components/SignList";
import { Store } from "../flux";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState(Store.getSearchTerm());
  const [searchState, setSearchState] = useState(Store.getSearchState());
  useEffect(() => {
    Store.addChangeListener(() => {
      setSearchTerm(Store.getSearchTerm());
      setSearchState(Store.getSearchState());
    });
  }, []);
  
  const { t } = useTranslation();

  return (
    <>
      <AboutUsPreview />

      {/* Search Lists */}
      {searchState ? (
        <SignList filter={searchTerm} />
      ) : (
        <Container fluid>
          <div className="category-list-wrapper">
            <Row>
              <Col  sm="12" md="12" lg="12" className="btn-view-all-categories">
                <a href="/browse-by-category">{t("view_all_category_btn")} &rarr;</a>                              
              </Col>
            </Row>
            <Row>             
              {/* Signs Blocks */}
              {allVocabsItems.slice(0, 3).map((category, key) => (
                  <CategoryList category={category} key={key} />
              ))}                
            </Row>
          </div>
        </Container>
      )}
    </>
  );
};

export default Home;
