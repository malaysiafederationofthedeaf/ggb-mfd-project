import React from "react";
import { ListGroup, ListGroupItem, Col, Row } from "shards-react";
import ReactPlayer from 'react-player';

const VocabDetail = ({vocab}) => (
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
                    <img src={vocab.image} alt={vocab.word} className="vocab-image" />
                </Col>
            </Row>
            <Row>
                <ReactPlayer url={vocab.video} playing={true} controls={true} loop={true} width="100%"/>
            </Row>
        </ListGroupItem>
    </ListGroup>
);

export default VocabDetail;
