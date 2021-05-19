import React from "react";
import { Link } from "react-router-dom";
import { Col, ListGroup, ListGroupItem, Row } from "shards-react";

const SearchVocabList = ({vocabs, group, category}) => {
    return(
        <ListGroup flush>    
            {vocabs.map((vocab, key) => {
            const groupTitle = group === undefined ? vocab.group : group;
            const categoryTitle = category === undefined ? vocab.category : category;

                return(
                    <Link key={key} to={`/${groupTitle}/${categoryTitle}/${vocab.word.toLowerCase()}`}>                  
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
                            </Row>
                        </ListGroupItem>
                    </Link>
                );
            })}
        </ListGroup>
    );
}

export default SearchVocabList;
