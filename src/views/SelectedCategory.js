import React from "react";
import { Container, Col, Row } from "shards-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import ComingSoon from "./ComingSoon";
import PageTitle from "../components/common/PageTitle";
import VocabList from "../components/category-vocabs/VocabList";
import { Store } from "../flux";
import Breadcrumbs from "../components/layout/Breadcrumbs/Breadcrumbs";

const SelectedCategory = () => {
  const { group, category } = useParams();
  const pathTail = window.location.pathname.split("/").pop()
  const isNewSignCategory = pathTail === "new-signs"; // for new-sign category
  const groupSelected = isNewSignCategory ? pathTail : group;
  const categoryEng = category;

  const { t } = useTranslation("group-category");

  const categoryFormatted = Store.formatString(categoryEng);
  const groupFormatted = Store.formatString(group);
  const vocabs = isNewSignCategory ? Store.getNewSigns() : Store.getVocabList(groupSelected, categoryFormatted);
  const title = isNewSignCategory ? groupFormatted : categoryFormatted

  // return Error page if no Vocabs are returned
  if (vocabs.length === 0) return <ComingSoon />;

  return (
    <>
      <Breadcrumbs />
      <Container
        fluid
        className="main-content-container px-4 vocab-list-wrapper"
      >
        <Row noGutters className="page-header">
          <PageTitle
            title={t(title)}
            md="12"
            className="ml-sm-auto mr-sm-auto"
          />
        </Row>
        <Row>
          <Col>
            <VocabList vocabs={vocabs} group={groupSelected} category={categoryEng}/>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SelectedCategory;
