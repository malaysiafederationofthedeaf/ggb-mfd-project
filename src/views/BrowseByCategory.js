import React from "react";
import { Container, Row } from "shards-react";
import { useTranslation } from "react-i18next";

import CategoryList from "../components/category-vocabs/CategoryList";
import { Store } from "../flux";

const BrowseByCategory = () => {
  const { t } = useTranslation();  
  return (
    <div className="category-list-wrapper">
      <Container fluid className="main-content-container">
      <Row className="p-4">
          <h1>{t("category")}</h1>
        </Row>
        <Row>
          {Store.getGroups().map((group, key) => (
              <CategoryList category={Store.getCategoriesOfGroup(group.group)} group={group.group} key={key} />
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default BrowseByCategory;
