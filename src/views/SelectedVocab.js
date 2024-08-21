import React from "react";
import { useParams } from 'react-router-dom';
import { Container } from "shards-react";

import ComingSoon from "./ComingSoon";
import VocabDetail from "../components/category-vocabs/VocabDetail";
import { Store } from "../flux";
import Breadcrumbs from "../components/layout/Breadcrumbs/Breadcrumbs";

const SelectedVocab = ({ match }) => {
  const { vocab } = useParams();

  const categoryVocab = Store.getVocabDetail(vocab);

  // return Error page if no Vocab Details are returned
  if (!categoryVocab) return <ComingSoon />;

  const vocabDetails = categoryVocab[0];

  return (
    <>
      <div className="breadcrumbs-selected-vocab">
        <Breadcrumbs vocab={categoryVocab} />
      </div>
      <Container
        fluid
        className="main-content-container vocab-list-wrapper"
      >
        <VocabDetail vocab={vocabDetails} />
      </Container>
    </>
  );
};

export default SelectedVocab;
