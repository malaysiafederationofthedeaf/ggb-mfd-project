import React from "react";
import { Container } from "shards-react";

import ComingSoon from "./ComingSoon";
import VocabDetail from "../components/category-vocabs/VocabDetail";
import { Store } from "../flux";
import Breadcrumbs from "../components/layout/Breadcrumbs/Breadcrumbs";
import { useTranslation } from "react-i18next";

const SelectedVocab = ({ match }) => {
  const signEng = match.params.vocab;

  const categoryVocab = Store.getVocabDetail(signEng);
  // return Error page if no Vocab Details are returned
  if (!categoryVocab) return <ComingSoon />;
  const vocab = categoryVocab[0];

  useTranslation();

  return (
    <>
      <div className="breadcrumbs-selected-vocab">
        <Breadcrumbs vocab={categoryVocab} />
      </div>
      <Container
        fluid
        className="main-content-container vocab-list-wrapper"
      >
        <VocabDetail vocab={vocab} />
      </Container>
    </>
  );
};

export default SelectedVocab;
