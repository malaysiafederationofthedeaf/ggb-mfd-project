import React from "react";
import { ListGroup, ListGroupItem, Col, Row } from "shards-react";
import ReactPlayer from 'react-player';

import { Store } from "../../flux";

const VocabDetail = ({vocab}) => {
    const vocabImgSrc = Store.getSignImgSrc(vocab.wordMalay.toLowerCase());

    return (
        <ListGroup flush className="py-2">    
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
                        <img src={vocabImgSrc} alt={vocab.word} className="vocab-image" />
                    </Col>
                </Row>
                <Row>
                    <ReactPlayer url={vocab.video} playing={true} controls={true} loop={true} width="100%"/>
                </Row>
            </ListGroupItem>
        </ListGroup>
    );
}

export default VocabDetail;
