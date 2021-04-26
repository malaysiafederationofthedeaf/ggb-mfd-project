import React from "react";
import { Container, Col, Row } from "shards-react";

import Errors from "./Errors";
import PageTitle from "../components/common/PageTitle";
import VocabList from "../components/category-vocabs/VocabList";
import { Store } from "../flux";

const SelectedCategory = ({match}) => {
    const categoryEng = match.params.category;

    const vocabs = Store.getVocabList(categoryEng);
    if (vocabs['vocabs'].length === 0) return <Errors />

    return(
        <Container fluid className="main-content-container px-4 vocab-list-wrapper">
            <Row noGutters className="page-header py-4">
                <PageTitle title={vocabs.category} md="12" className="ml-sm-auto mr-sm-auto" />
            </Row>
            <Row className="py-4">
                <Col>
                    <VocabList vocabs={vocabs} category={categoryEng}/>
                </Col>
            </Row>
      </Container>
    );
}

export default SelectedCategory;