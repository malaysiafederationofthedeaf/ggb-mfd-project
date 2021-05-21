import React from "react";
import { Link } from "react-router-dom";
import { Col, ListGroup, ListGroupItem, Row } from "shards-react";
import i18next from "i18next";

import { Store } from "../../flux";

const SearchVocabList = ({vocabs, group, category}) => {
    return(
        <ListGroup flush>    
            {vocabs.map((vocab, key) => {
            const groupTitle = group === undefined ? vocab.group : group;
            const categoryTitle = category === undefined ? vocab.category : category;

                return(
                    <Link key={key} to={`/${Store.formatString(groupTitle)}/${Store.formatString(categoryTitle)}/${Store.formatString(vocab.word)}`}>                  
                        <ListGroupItem>
                            <Row data-aos="fade-up" data-aos-delay="200" className="vocab-word">
                                <Col sm="12" md="4" lg="2">
                                    <strong className="text-muted d-block mb-2">
                                        {i18next.language==="en" ? vocab.word : vocab.perkataan}
                                    </strong>
                                    <strong className="text d-block mb-2">
                                        {i18next.language==="en" ? vocab.perkataan : vocab.word}
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
