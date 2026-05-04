import React, { useEffect, useState } from "react"; 
import { Col, Row } from "shards-react";
import ReactPlayer from "react-player";
import { Store } from "../../flux";
import VocabWordPerkataan from "./VocabWordPerkataan";

const VocabDetail = ({ vocab }) => {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const baseUrl = Store.getSignImgSrc(vocab.perkataan);
    if (!baseUrl) {
      setImageUrls([]);
      return;
    }

    const match = baseUrl.match(/^(.*)(\.[^.]+)$/);
    const prefix = match ? match[1] : baseUrl;
    const ext = match ? match[2] : "";

    let isCancelled = false;
    const urls = [baseUrl];
    setImageUrls(urls);

    const probeNext = (index) => {
      const url = `${prefix}-${index}${ext}`;
      const img = new Image();

      img.onload = () => {
        if (isCancelled) return;
        urls.push(url);
        setImageUrls([...urls]);
        probeNext(index + 1); // try next suffix
      };

      img.onerror = () => {
        if (isCancelled) return;
        // stop probing on first missing suffix
      };

      img.src = url;
    };

    // start probing at -2
    probeNext(2);

    return () => {
      isCancelled = true;
    };
  }, [vocab.perkataan]);

  return (
    <div className="selected-vocab">
      <Row className="selected-vocab-title">
        <Col>
          <VocabWordPerkataan
            word={vocab.word}
            perkataan={vocab.perkataan}
          />
        </Col>
      </Row>
      <Row className="selected-vocab-detail">
        <Col xl="6" lg="12" md="12" sm="12">
          <div className="selected-vocab-image-wrapper">
            {imageUrls.length === 0 ? (
              <img
                src={`https://pub-53c2a4aa4b544b0fb5ca676a1f4675e0.r2.dev/images/bim/coming-soon.avif`}
                alt={vocab.word}
                className="selected-vocab-image"
              />
            ) : (
              imageUrls.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`${vocab.word} ${index + 1}`}
                  className="selected-vocab-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://pub-53c2a4aa4b544b0fb5ca676a1f4675e0.r2.dev/images/bim/coming-soon.avif`;
                  }}
                />
              ))
            )}
          </div>
        </Col>

        <Col xl="6" lg="12" md="12" sm="12">
          <div>
            {vocab.video === undefined ? (
              <div className="selected-vocab-image-wrapper">
                <img
                  src={require(`../../images/general/video-coming-soon.jpg`)}
                  alt={vocab.word}
                  className="selected-vocab-image"
                />
              </div>
            ) : (
              <div className="selected-vocab-video-wrapper">
                <ReactPlayer
                  url={vocab.video}
                  playing={true}
                  controls={true}
                  loop={true}
                  width="100%"
                />
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default VocabDetail;