import React from "react";
import { Container, Col, Row } from "shards-react";
import { useTranslation } from "react-i18next";

import ComingSoon from "./ComingSoon";
import PageTitle from "../components/common/PageTitle";
import GroupList from "../components/category-vocabs/GroupList";
import Breadcrumbs from "../components/layout/Breadcrumbs/Breadcrumbs";
import { Store } from "../flux";

const SelectedGroup = ({ match }) => {
  const group = match.params.group;
  const categories = Store.getCategoriesOfGroup(group);
  // return Error page if no Categories are returned
  if (!categories) return <ComingSoon />;

  const { t } = useTranslation("group-category");
  return (
    <>
      <Breadcrumbs />
      <Container
        fluid
        className="main-content-container px-4 vocab-list-wrapper"
      >
        <Row noGutters className="page-header py-4">
          <PageTitle
            title={t(group)}
            md="12"
            className="ml-sm-auto mr-sm-auto"
          />
        </Row>
        <Row>
          <Col>
            <GroupList categories={categories} group={group}/>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SelectedGroup;
