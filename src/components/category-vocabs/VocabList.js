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

        const vocabImgSrc = Store.getSignImgSrc(vocab.perkataan);

        const groupFormatted = Store.formatString(groupTitle);
        const categoryFormatted = Store.formatString(categoryTitle);
        const wordFormatted = Store.formatString(vocab.word);
        const basePath = `/groups/${groupFormatted}`
        const linkToPath = groupFormatted === "new-signs" ? `${basePath}/${wordFormatted}` : `${basePath}/${categoryFormatted}/${wordFormatted}`;

        return (
          <Link
            key={key}
            to={`${linkToPath}`}
          >
            <ListGroupItem className="double">
              <Row className="vocab-word">              
                <Col xs="3" sm="5" md="5" lg="5" className="vocab-image-wrapper">
                  <img
                    src={vocabImgSrc}
                    alt={vocab.word}
                    className="vocab-image"
                  />
                </Col>   
                <Col xs="9" sm="7" md="7" lg="7" className="pl-2 pr-0">
                  <VocabWordPerkataan
                    word={vocab.word}
                    perkataan={vocab.perkataan}
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
