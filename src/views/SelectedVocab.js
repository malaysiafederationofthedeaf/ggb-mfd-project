import React from "react";
import vocabsItems from "../data/categories/vocabs-items";
import { Container, Row } from "shards-react";

import Errors from "./Errors";
import PageTitle from "../components/common/PageTitle";
import VocabDetail from "../components/category-vocabs/VocabDetail";

const SelectedVocab = ({match}) => {
    const cat = match.params.category;

    const name = match.params.vocab;

    const vocabs = vocabsItems.find(category => category.category.toLowerCase() === cat);

    const vocab = vocabs.vocabs.find(vocab => vocab.word.toLowerCase() === name);
    console.log(vocab);

    if (!vocab) return <Errors />

    return(
        <Container fluid className="main-content-container px-4">
          <Row noGutters className="page-header py-4">
            <PageTitle title={vocabs.categoryMalay} subtitle={cat} md="12" className="ml-sm-auto mr-sm-auto" />
          </Row>
          <VocabDetail vocab={vocab} />
      </Container>
    );
}

export default SelectedVocab;