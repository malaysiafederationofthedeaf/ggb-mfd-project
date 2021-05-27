import React from "react";
import { Container, Row } from "shards-react";
import { useTranslation } from "react-i18next";

import ComingSoon from "./ComingSoon";
import PageTitle from "../components/common/PageTitle";
import VocabDetail from "../components/category-vocabs/VocabDetail";
import { Store } from "../flux";
import Breadcrumbs from "../components/layout/Breadcrumbs/Breadcrumbs";

const SelectedVocab = ({ match }) => {
  const signEng = match.params.vocab;

  const { t } = useTranslation("group-category");

  const categoryVocab = Store.getVocabDetail(signEng);
  // return Error page if no Vocab Details are returned
  if (!categoryVocab) return <ComingSoon />;
  const vocab = categoryVocab[0];

  return (
    <>
      <div className="breadcrumbs-selected-vocab">
        <Breadcrumbs vocab={categoryVocab} />
      </div>
      <Container
        fluid
        className="main-content-container px-4 vocab-detail-wrapper"
      >
        <Row noGutters className="page-header py-4">
          <PageTitle
            title={t(Store.formatString(vocab.category))}
            md="12"
            className="ml-sm-auto mr-sm-auto"
          />
        </Row>
        <VocabDetail vocab={vocab} />
      </Container>
    </>
  );
};

export default SelectedVocab;
