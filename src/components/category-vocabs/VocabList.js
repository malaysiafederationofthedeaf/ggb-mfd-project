import React from "react";
import { ListGroup, ListGroupItem, Col, Row } from "shards-react";
import { Link } from "react-router-dom";

const VocabList = ({vocabs}) => (
    <ListGroup flush>    
        {vocabs.vocabs.map((vocab, key) => (
            <Link key={key} to={`/vocab/${vocabs.category.toLowerCase()}/${vocab.word.toLowerCase()}`}>
                <ListGroupItem>
                    <Row>
                        <Col>
                            <strong className="text-muted d-block mb-2">
                                {vocab.wordMalay}
                            </strong>
                            <strong className="text d-block mb-2">
                                {vocab.word}
                            </strong>
                        </Col>
                        <Col>
                            <img src={vocab.image} alt="sans" style={{width: "180px", height: "auto", float: "right"}}/>
                        </Col>
                    </Row>
                </ListGroupItem>
            </Link>
        ))}
    </ListGroup>
);

export default VocabList;
