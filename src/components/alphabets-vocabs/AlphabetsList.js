import React from "react";
import { Link } from "react-router-dom";
import { Col, ListGroup, ListGroupItem, Row } from "shards-react";

import { Store } from "../../flux";
import { COMING_SOON_IMAGE_URL } from "../../config";
import VocabWordPerkataan from "../category-vocabs/VocabWordPerkataan";
import { trimWord } from "../../utils/stringUtils";
import LazyImage from "../common/LazyImage";

const AlphabetsList = ({ vocabs, alphabet }) => {


  return (
    <ListGroup flush>
      {vocabs.map((vocab) => {
        const vocabImgSrc = Store.getSignImgSrc(vocab.perkataan);
        const vocabParam = encodeURIComponent(vocab.word);
        return (
          <Link key={vocab.word} to={`/alphabets/${alphabet}/${vocabParam}`}>
            <ListGroupItem className="double">
              <Row className="vocab-word">
                <Col className="vocab-image-wrapper">
                  <LazyImage
                    src={vocabImgSrc}
                    alt={vocab.word}
                    className="vocab-image"
                    onError={(e) => {
                      e.target.onerror = null; // prevent infinite loop
                      e.target.src = COMING_SOON_IMAGE_URL; // if there is no image url
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

export default AlphabetsList;
