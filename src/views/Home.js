import React from "react";
import { Container, Row, Col } from "shards-react";
import { useTranslation } from "react-i18next";

import AboutUsPreview from "../components/about-us/AboutUsPreview";
import CategoryList from "../components/category-vocabs/CategoryList";
import FeaturedVideoList from "../components/featured-videos/FeaturedVideoList";
import { Store } from "../flux";
import { Link } from "react-router-dom";
import OneSignADayCard from "../components/one-sign-a-day/OneSignADayCard";

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
              group.group !== "New Signs" &&
              <CategoryList
                category={Store.getCategoriesOfGroup(group.group)}
                group={group.group}
                key={key}
                className="category-list"
              />              
            ))}
          </Row>
          <Row>
            {/* View all categories button */}
            <Col sm="12" md="12" lg="12" className="btn-view-all-categories">
              <Link to="/groups">{t("view_all_category_btn")} &rarr;</Link>
            </Col>
            {/* New Signs Category */}
            <CategoryList
              category={Store.getCategoriesOfGroup("New Signs")}
              group={"New Signs"}
            />
            {/* Featured Videos List to be displayed in Home Page */}
            <FeaturedVideoList videoItems={Store.getFeaturedVideosList()}/>
            <OneSignADayCard/>             
          </Row>
        </div>
      </Container>
    </>
  );
};

export default Home;
