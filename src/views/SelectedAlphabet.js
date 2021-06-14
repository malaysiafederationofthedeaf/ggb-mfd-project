import React, { useState } from "react";
import { Container, Col, Row } from "shards-react";
import ItemsCarousel from "react-items-carousel";

import ComingSoon from "./ComingSoon";
import PageTitle from "../components/common/PageTitle";
import { Store } from "../flux";
import AlphabetsGrid from "../components/alphabets-vocabs/AlphabetsGrid";
import AlphabetsList from "../components/alphabets-vocabs/AlphabetsList";

const SelectedAlphabets = ({ match }) => {
  const alphas = match.params.alphabet;
  const alphasFormatted = Store.formatString(alphas);
  const alphasLists = Store.getAlphabetsList();
  const vocabs = Store.getVocabsAlphabet(alphasFormatted);

  const [activeItemIndex, setActiveItemIndex] = useState(0);
  // return Error page if no Vocabs are returned
  if (vocabs.length === 0) return <ComingSoon />;

  return (
    <>
      <div className=" breadcrumb d-lg-none d-xl-none d-block ">
        <ItemsCarousel
          numberOfCards={11}
          gutter={10}
          showSlither={true}
          freeScrolling={false}
          requestToChangeActive={(activeItemIndex) =>
            setActiveItemIndex(activeItemIndex)
          }
          activeItemIndex={activeItemIndex}
          outsideChevron={false}
        >
          {alphasLists.map((alpha, key) => (
            <AlphabetsGrid alphabets={alpha} key={key} />
          ))}
        </ItemsCarousel>
      </div>

      <Container
        fluid
        className="main-content-container px-4 vocab-list-wrapper"
      >
        <Row noGutters className="page-header py-4">
          <PageTitle title={alphas} md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>
        <Row>
          <Col>
            <AlphabetsList vocabs={vocabs} alphabet={alphas} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SelectedAlphabets;
