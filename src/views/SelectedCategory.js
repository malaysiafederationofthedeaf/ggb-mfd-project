import React from "react";
import { Container, Col, Row } from "shards-react";
import { useTranslation } from "react-i18next";

import ComingSoon from "./ComingSoon";
import PageTitle from "../components/common/PageTitle";
import VocabList from "../components/category-vocabs/VocabList";
import { Store } from "../flux";
import Breadcrumbs from "../components/layout/Breadcrumbs/Breadcrumbs";

const SelectedCategory = ({ match }) => {
  const group = match.params.group;
  const categoryEng = match.params.category;

  const { t } = useTranslation("group-category");

  const categoryFormatted = Store.formatString(categoryEng);
  const groupFormatted = Store.formatString(group);
  const vocabs = Store.getVocabList(groupFormatted, categoryFormatted);
  // return Error page if no Vocabs are returned
  if (vocabs.length === 0) return <ComingSoon />;

  return (
    <>
      <Breadcrumbs />
      <Container
        fluid
        className="main-content-container px-4 vocab-list-wrapper"
      >
        <Row noGutters className="page-header py-4">
          <PageTitle
            title={t(categoryFormatted)}
            md="12"
            className="ml-sm-auto mr-sm-auto"
          />
        </Row>
        <Row>
          <Col>
            <VocabList vocabs={vocabs} group={group} category={categoryEng}/>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SelectedCategory;
