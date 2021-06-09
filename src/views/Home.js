import React from "react";
import { Container, Row, Col } from "shards-react";
import { useTranslation } from "react-i18next";

import AboutUsPreview from "../components/about-us/AboutUsPreview";
import CategoryList from "../components/category-vocabs/CategoryList";
import { Store } from "../flux";
import { Link } from "react-router-dom";

const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <AboutUsPreview />
      <Container fluid>
        <div className="category-list-wrapper">
          <Row>
            {/* Top 3 Sign Groups to be displayed in Home Page*/}
            {Store.getGroupsHome().map((group, key) => (
              <CategoryList
                category={Store.getCategoriesOfGroup(group.group)}
                group={group.group}
                key={key}
              />
            ))}
          </Row>
          <Row>
            <Col sm="12" md="12" lg="12" className="btn-view-all-categories">
              <Link to="/groups">{t("view_all_category_btn")} &rarr;</Link>
            </Col>
          </Row>          
        </div>
      </Container>
    </>
  );
};

export default Home;
