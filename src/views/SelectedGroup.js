import React from "react";
import { Container, Col, Row } from "shards-react";
import { useTranslation } from "react-i18next";

import Errors from "./Errors";
import PageTitle from "../components/common/PageTitle";
import categoriesItems from "../data/categories/categories-items";
import GroupList from "../components/category-vocabs/GroupList";

const SelectedGroup = ({match}) => {
    const group = match.params.group;
    const categories = categoriesItems.find(category => category.categoryGroup.toLowerCase() === group);
    if (!categories) return <Errors />

    const { t } = useTranslation();
    return(
        <Container fluid className="main-content-container px-4 vocab-list-wrapper">
            <Row noGutters className="page-header py-4">
                <PageTitle title={t(categories.categoryGroup)} md="12" className="ml-sm-auto mr-sm-auto" />
            </Row>
            <Row>
                <Col>
                    <GroupList categories={categories.categories} />
                </Col>
            </Row>
      </Container>
    );
}

export default SelectedGroup;