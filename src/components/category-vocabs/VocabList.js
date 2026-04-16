import React from "react";
import { Link } from "react-router-dom";
import { Col, ListGroup, ListGroupItem, Row } from "shards-react";

import { Store } from "../../flux";
import { COMING_SOON_IMAGE_URL } from "../../config";
import VocabWordPerkataan from "./VocabWordPerkataan";
import { trimWord } from "../../utils/stringUtils";

const VocabList = ({ vocabs, group, category }) => {
  // Shared trimWord utility is used when passing props to VocabWordPerkataan

  return (
    <ListGroup flush>
      {vocabs.map((vocab) => {
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
            key={vocab.word}
            to={`${linkToPath}`}
          >
            <ListGroupItem className="double">
              <Row className="vocab-word">
                <Col className="vocab-image-wrapper">
                  <img
                    src={vocabImgSrc}
                    alt={vocab.word}
                    className="vocab-image"
                    onError={(e) => {
                      e.target.onerror = null; // prevent infinite loop
                      e.target.src = COMING_SOON_IMAGE_URL; //if there is no image url
                    }
                    }
                  />
                </Col>
                <Col className="pl-2 pr-0">
                  <VocabWordPerkataan
                    word={trimWord(vocab.word)}
                    perkataan={trimWord(vocab.perkataan)}
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
