import React from "react";
import { Container, Row } from "shards-react";

import categoriesItems from "../data/categories/categories-items";
import CategoryList from "../components/category-vocabs/CategoryList";

import { useTranslation } from "react-i18next";

const BrowseByCategory = () => {
  const { t } = useTranslation();  
  return (
    <div className="category-list-wrapper">
      <Container fluid className="main-content-container">
        <Row>
          <h1>{t("category")}</h1>
        </Row>
        <Row>
            {categoriesItems.map((category, key) => (
              <CategoryList category={category} key={key} />
            ))}              
        </Row>
      </Container>
    </div>
  );
}

export default BrowseByCategory;
