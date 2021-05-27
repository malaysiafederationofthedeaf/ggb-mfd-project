import React from "react";
import { Container, Row, Col } from "shards-react";
import { useTranslation } from "react-i18next";

import AboutUsPreview from "../components/about-us/AboutUsPreview";
import CategoryList from "../components/category-vocabs/CategoryList";
import { Store } from "../flux";

const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <AboutUsPreview />
        <Container fluid>
          <div className="category-list-wrapper">
            <Row>
              <Col  sm="12" md="12" lg="12" className="btn-view-all-categories">
                <a href="/browse-by-category">{t("view_all_category_btn")} &rarr;</a>                              
              </Col>
            </Row>
            <Row>             
              {/* Top 3 Sign Groups */}
              {Store.getTop3Groups().map((group, key) => (
                <CategoryList category={Store.getCategoriesOfGroup(group.group)} key={key} />
              ))}                          
            </Row>
          </div>
        </Container>
    </>
  );
};

export default Home;
