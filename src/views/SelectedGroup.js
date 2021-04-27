import React from "react";
import { Container, Col, Row } from "shards-react";
import { useTranslation } from "react-i18next";

import Errors from "./Errors";
import PageTitle from "../components/common/PageTitle";
import allVocabsItems from "../data/categories/all-vocabs-items";
import GroupList from "../components/category-vocabs/GroupList";
import Breadcrumbs from "../components/layout/Breadcrumbs/Breadcrumbs";

const SelectedGroup = ({match}) => {
    const group = match.params.group;
    const categories = allVocabsItems.find(category => category.categoryGroup.toLowerCase() === group);
    if (!categories) return <Errors />

    const { t } = useTranslation();
    return(
    <>
        <Breadcrumbs />
        <Container fluid className="main-content-container px-4 vocab-list-wrapper">
            <Row noGutters className="page-header py-4">
                <PageTitle title={t(categories.categoryGroup)} md="12" className="ml-sm-auto mr-sm-auto" />
            </Row>
            <Row>
                <Col>
                    <GroupList group={categories.categoryGroup} categories={categories.categories} />
                </Col>
            </Row>
        </Container>
    </>
    );
}

export default SelectedGroup;