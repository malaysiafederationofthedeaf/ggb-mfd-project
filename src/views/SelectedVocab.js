import React from "react";
import { Container, Row } from "shards-react";
import { useTranslation } from "react-i18next";

import Errors from "./Errors";
import PageTitle from "../components/common/PageTitle";
import VocabDetail from "../components/category-vocabs/VocabDetail";
import { Store } from "../flux";
import Breadcrumbs from "../components/layout/Breadcrumbs/Breadcrumbs";

const SelectedVocab = ({match}) => {
    const categoryEng = match.params.category;
    const signEng = match.params.vocab;   

    const { t } = useTranslation();

    const categoryVocab = Store.getVocabDetail(t(categoryEng).toLowerCase(), signEng);

    if (!categoryVocab) return <Errors />    
        
    const category = categoryVocab.category;
    const vocab = categoryVocab.vocab;

    return(
      <>
      <div className="breadcrumbs-selected-vocab">
        <Breadcrumbs vocab={vocab} />
      </div>
      <Container fluid className="main-content-container px-4 vocab-detail-wrapper">
        <Row noGutters className="page-header py-4">
          <PageTitle title={category.titleMalay} subtitle={categoryEng} md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>
        <VocabDetail vocab={vocab} />
      </Container>
      </>
    );
}

export default SelectedVocab;