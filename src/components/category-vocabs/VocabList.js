import React from "react";
import { ListGroup, ListGroupItem, Col, Row } from "shards-react";
import { Link } from "react-router-dom";

const VocabList = ({vocabs}) => (
    <ListGroup flush>    
        {vocabs.vocabs.map((vocab, key) => (
            <Link key={key} to={`/vocab/${vocabs.category.toLowerCase()}/${vocab.word.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit'}}>
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
                                <i class="material-icons">play_circle_filled</i>    
                            </button>                            
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
