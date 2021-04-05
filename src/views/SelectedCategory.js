import React from "react";
import { Container, Col, Row } from "shards-react";

import Errors from "./Errors";
import PageTitle from "../components/common/PageTitle";
import vocabsItems from "../data/categories/vocabs-items";
import VocabList from "../components/category-vocabs/VocabList";

const SelectedCategory = ({match}) => {
    const name = match.params.category;
    console.log(name);
    console.log(vocabsItems[0].category);
    const vocabs = vocabsItems.find(category => category.category.toLowerCase() === name);
    console.log(vocabs);

    if (!vocabs) return <Errors />

    return(
        <Container fluid className="main-content-container px-4">
            <Row noGutters className="page-header py-4">
                <PageTitle title={vocabs.category} md="12" className="ml-sm-auto mr-sm-auto" />
            </Row>
            <Row className="py-4">
                <Col>
                    <VocabList vocabs={vocabs} />
                </Col>
            </Row>
      </Container>
    );
}

export default SelectedCategory;