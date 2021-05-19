import React from "react";
import { ListGroup, ListGroupItem, Col, Row } from "shards-react";
import ReactPlayer from 'react-player';

import { Store } from "../../flux";

const VocabDetail = ({vocab}) => {
    const vocabImgSrc = Store.getSignImgSrc(vocab.wordMalay.toLowerCase());

    return (
        <ListGroup flush className="py-2">    
            <ListGroupItem className="p-0">
                <Row className="selected-vocab-title">
                    <Col>
                        <strong className="text-muted d-block mb-2">
                            {vocab.wordMalay}
                        </strong>
                        <strong className="text d-block mb-2">
                            {vocab.word}
                        </strong>
                    </Col>
                </Row>
                <Row>        
                    <Col lg="12" md="12" sm="12">
                        <div className="selected-vocab-image-wrapper">
                            <img src={vocabImgSrc} alt={vocab.word} className="selected-vocab-image" />
                        </div>
                    </Col>                                
                    <Col lg="12" md="12" sm="12" >
                        <div className="selected-vocab-video-wrapper">
                            <ReactPlayer url={vocab.video} playing={true} controls={true} loop={true} width="100%"/>
                        </div>                        
                    </Col>                    
                </Row>
            </ListGroupItem>
        </ListGroup>
    );
}

export default VocabDetail;
