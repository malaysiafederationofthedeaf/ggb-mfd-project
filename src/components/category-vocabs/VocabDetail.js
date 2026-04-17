import React from "react";
import { Col, Row, Card, CardBody } from "shards-react";
import ReactPlayer from 'react-player';
import cookies from "js-cookie";

import { Store } from "../../flux";
import VocabWordPerkataan from "./VocabWordPerkataan";

const VocabDetail = ({vocab, currentLang: langProp}) => {
    const useBlobImages = process.env.REACT_APP_USE_BLOB_IMAGES === "true";
    const currentLang = langProp || cookies.get("i18next") || "ms";
    const vocabImgSrc = useBlobImages && vocab.imageUrl ? vocab.imageUrl : Store.getSignImgSrc(vocab.perkataan);

    return (
        <div className="selected-vocab">
            <Row className="selected-vocab-title">
                <Col>
                    <VocabWordPerkataan word={vocab.word} perkataan={vocab.perkataan} />
                </Col>
            </Row>
            <Row className="selected-vocab-detail">        
                <Col xl="6" lg="12" md="12" sm="12">
                    <div className="selected-vocab-image-wrapper">
                        <img 
                         src={vocabImgSrc} 
                         alt={vocab.word} 
                         className="selected-vocab-image"  
                         onError={(e) => {
                            e.target.onerror = null; // prevent infinite loop
                            e.target.src = `https://res.cloudinary.com/dvkbfpll1/image/upload/v1745120594/image-coming-soon.jpg`; // if there is no image url
                        }
                        }
                    />
                    </div>
                </Col>                                
                <Col xl="6" lg="12" md="12" sm="12" >
                    <div>
                        {vocab.video === undefined ? 
                            // if there is no video url
                            <div className="selected-vocab-image-wrapper">     
                                <img src={require(`../../images/general/video-coming-soon.jpg`)} alt={vocab.word}className="selected-vocab-image" />
                            </div> :
                            <div className="selected-vocab-video-wrapper">
                                <ReactPlayer url={vocab.video} playing={true} controls={true} loop={true} width="100%"/>
                            </div>
                        }
                    </div>
                </Col>                    
            </Row>
            <Row className="selected-vocab-example mt-4">
              <Col>
                <Card style={{ backgroundColor: '#f5f5f5', border: '1px solid #e8e8e8' }}>
                  <CardBody>
                    <h4>{currentLang === "ms" ? "Contoh Ayat" : "Example Sentence"}</h4>
                    <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>
                      {vocab.exampleSentence || (currentLang === "ms" ? 'Tiada contoh ayat tersedia.' : 'No example sentence available.')}
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
        </div>
    );
}

export default VocabDetail;
