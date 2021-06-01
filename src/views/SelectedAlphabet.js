import React from "react";
import { Container, Col, Row } from "shards-react";

import ComingSoon from "./ComingSoon";
import PageTitle from "../components/common/PageTitle";
import { Store } from "../flux";
import Breadcrumbs from "../components/layout/Breadcrumbs/Breadcrumbs";
import AlphabetsList from "../components/alphabets-vocabs/AlphabetsList";

const SelectedAlphabets = ({ match }) => {
  const alphas = match.params.alphabet;
  const alphasFormatted = Store.formatString(alphas);
  const vocabs = Store.getVocabsAlphabet(alphasFormatted);
  // return Error page if no Vocabs are returned
  if (vocabs.length === 0) return <ComingSoon />;

  return (
    <>
      <Breadcrumbs />
      <Container
        fluid
        className="main-content-container px-4 vocab-list-wrapper"
      >
        <Row noGutters className="page-header py-4">
          <PageTitle title={alphas} md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>
        <Row className="py-4">
          <Col md="12" lg="11">
            <AlphabetsList vocabs={vocabs} alphabets={alphas} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SelectedAlphabets;
