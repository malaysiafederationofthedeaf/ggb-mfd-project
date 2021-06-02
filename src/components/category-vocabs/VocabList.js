import React from "react";
import { Link } from "react-router-dom";
import { Col, ListGroup, ListGroupItem, Row } from "shards-react";

import { Store } from "../../flux";
import VocabWordPerkataan from "./VocabWordPerkataan";

const VocabList = ({ vocabs, group, category }) => {
  return (
    <ListGroup flush>
      {vocabs.map((vocab, key) => {
        const groupTitle = group === undefined ? vocab.group : group;
        const categoryTitle =
          category === undefined ? vocab.category : category;

        const vocabImgSrc = Store.getSignImgSrc(
          vocab.kategori,
          vocab.perkataan
        );

        const groupFormatted = Store.formatString(groupTitle);
        const categoryFormatted = Store.formatString(categoryTitle);
        const wordFormatted = Store.formatString(vocab.word);

        return (
          <Link
            key={key}
            to={`/groups/${groupFormatted}/${categoryFormatted}/${wordFormatted}`}
          >
            <ListGroupItem>
              <Row
                data-aos="fade-up"
                data-aos-delay="200"
                className="vocab-word"
              >
                <Col sm="12" md="4" lg="3">
                  <VocabWordPerkataan
                    word={vocab.word}
                    perkataan={vocab.perkataan}
                  />
                </Col>
                <Col>
                  <button className="vocab-play-button">
                    <i className="material-icons">play_circle_filled</i>
                  </button>
                </Col>
                <Col>
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

export default VocabList;
