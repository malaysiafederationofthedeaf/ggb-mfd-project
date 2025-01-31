import React, { useState } from "react";
import { Container, Col, Row } from "shards-react";
import ItemsCarousel from "react-items-carousel";
import { useParams } from "react-router-dom";

import ComingSoon from "./ComingSoon";
import PageTitle from "../components/common/PageTitle";
import { Store } from "../flux";
import AlphabetsGrid from "../components/alphabets-vocabs/AlphabetsGrid";
import AlphabetsList from "../components/alphabets-vocabs/AlphabetsList";

const SelectedAlphabets = () => {
  const { alphabet } = useParams();
  const alphasFormatted = Store.formatString(alphabet);
  const alphasLists = Store.getAlphabetsList();
  const vocabs = Store.getVocabsAlphabet(alphasFormatted);

  const [activeItemIndex, setActiveItemIndex] = useState(0);
  // return Error page if no Vocabs are returned
  if (vocabs.length === 0) return <ComingSoon />;

  return (
    <>
      <div className="alphabet-breadcrumbs">
        <nav className="breadcrumb d-md-none d-lg-none d-xl-none d-block">
          <ItemsCarousel
            numberOfCards={10}
            gutter={10}
            slidesToScroll={4}
            showSlither={false}
            freeScrolling={false}
            chevronWidth={30}
            rightChevron={<i className="material-icons">chevron_right</i>}
            leftChevron={<i className="material-icons">chevron_left</i>}
            requestToChangeActive={(activeItemIndex) =>
              setActiveItemIndex(activeItemIndex)
            }
            activeItemIndex={activeItemIndex}
            outsideChevron={true}
            disableSwipe={false}
          >
            {alphasLists.map((alpha, key) => (
              <AlphabetsGrid alphabets={alpha} key={key} />
            ))}
          </ItemsCarousel>
        </nav>
      </div>

      <Container
        fluid
        className="main-content-container px-4 vocab-list-wrapper"
      >
        <Row noGutters className="page-header">
          <PageTitle title={alphabet} md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>
        <Row>
          <Col>
            <AlphabetsList vocabs={vocabs} alphabet={alphabet} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SelectedAlphabets;
