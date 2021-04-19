import React from "react";
import { Col, ListGroup, ListGroupItem, Row } from "shards-react";

const VocabList = ({vocabs}) => (
    <ListGroup flush>    
        {vocabs.vocabs.map((vocab, key) => (
            <a key={key} href={`/vocab/${vocabs.category.toLowerCase()}/${vocab.word.toLowerCase()}`}>
                <ListGroupItem>
                    <Row data-aos="fade-up" data-aos-delay="200" className="vocab-word">
                        <Col sm="12" md="4" lg="2">
                            <strong className="text-muted d-block mb-2">
                                {vocab.wordMalay}
                            </strong>
                            <strong className="text d-block mb-2">
                                {vocab.word}
                            </strong>
                        </Col>
                        <Col>
                            <button className="vocab-play-button" >
                                <i className="material-icons">play_circle_filled</i>    
                            </button>                            
                        </Col>                        
                        <Col>
                            <img src={vocab.image} alt={vocab.word} className="vocab-image" />
                        </Col>
                    </Row>
                </ListGroupItem>
            </a>
        ))}
    </ListGroup>
);

export default VocabList;
