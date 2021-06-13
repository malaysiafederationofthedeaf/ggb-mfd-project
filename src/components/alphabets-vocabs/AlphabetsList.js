import React from "react";
import { Link } from "react-router-dom";
import { Col, ListGroup, ListGroupItem, Row } from "shards-react";

import { Store } from "../../flux";
import VocabWordPerkataan from "../category-vocabs/VocabWordPerkataan";

const AlphabetsList = ({ vocabs, alphabet }) => {
  return (
    <ListGroup flush>
      {vocabs.map((vocab, key) => {
        const vocabImgSrc = Store.getSignImgSrc(vocab.perkataan);
        const wordFormatted = Store.formatString(vocab.word);
        return (
          <Link key={key} to={`/alphabets/${alphabet}/${wordFormatted}`}>
            <ListGroupItem>
              <Row
                data-aos="fade-up"
                data-aos-delay="200"
                className="vocab-word"
              >
                <Col xs="5" sm="5" md="5" lg="5">
                  <VocabWordPerkataan
                    word={vocab.word}
                    perkataan={vocab.perkataan}
                  />
                </Col>
                <Col xs="7" sm="7" md="7" lg="7" className="vocab-image-wrapper">
                  <img
                    src={vocabImgSrc}
                    alt={vocab.word}
                    className="vocab-image"
                  />
                </Col>
              </Row>
            </ListGroupItem>
          </Link>
        );
      })}
    </ListGroup>
  );
};

export default AlphabetsList;
