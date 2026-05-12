import React, { useEffect, useState } from "react";
import { Col, Row, Card, CardBody } from "shards-react";
import ReactPlayer from "react-player";
import cookies from "js-cookie";

import { Store } from "../../flux";
import { COMING_SOON_IMAGE_URL } from "../../config";
import VocabWordPerkataan from "./VocabWordPerkataan";
import LazyImage from "../common/LazyImage";

const VocabDetail = ({ vocab, currentLang: langProp }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [baseUrlDetails, setBaseUrlDetails] = useState(null);
  const currentLang = langProp || cookies.get("i18next") || "ms";

  useEffect(() => {
    const baseUrl = Store.getSignImgSrc(vocab.perkataan);
    if (!baseUrl) {
      setImageUrls([]);
      setBaseUrlDetails(null);
      return;
    }

    const match = baseUrl.match(/^(.*)(\.[^.]+)$/);
    const prefix = match ? match[1] : baseUrl;
    const ext = match ? match[2] : "";

    setBaseUrlDetails({ prefix, ext });
    setImageUrls([baseUrl]);
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
              <LazyImage
                src={COMING_SOON_IMAGE_URL}
                alt={vocab.word}
                className="selected-vocab-image"
              />
            ) : (
              imageUrls.map((src, index) => {
                const isFirst = index === 0;
                const isLast = index === imageUrls.length - 1;

                return (
                  <LazyImage
                    key={src}
                    src={src}
                    alt={`${vocab.word} ${index + 1}`}
                    className="selected-vocab-image"
                    fallback={isFirst ? COMING_SOON_IMAGE_URL : undefined}
                    onLoad={() => {
                      if (isLast && baseUrlDetails && src.startsWith(baseUrlDetails.prefix)) {
                        const nextUrl = `${baseUrlDetails.prefix}-${index + 2}${baseUrlDetails.ext}`;
                        setImageUrls(prev => {
                          if (!prev.includes(nextUrl)) return [...prev, nextUrl];
                          return prev;
                        });
                      }
                    }}
                    onError={() => {
                      if (!isFirst) {
                        setImageUrls(prev => prev.filter(url => url !== src));
                      }
                    }}
                  />
                );
              })
            )}
          </div>
        </Col>

        <Col xl="6" lg="12" md="12" sm="12">
          <div>
            {vocab.video === undefined ? (
              <div className="selected-vocab-image-wrapper">
                <LazyImage
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

      <Row className="selected-vocab-example mt-4">
        <Col>
          <Card
            style={{
              backgroundColor: "#f5f5f5",
              border: "1px solid #e8e8e8",
            }}
          >
            <CardBody>
              <h4>
                {currentLang === "ms" ? "Contoh Ayat" : "Example Sentence"}
              </h4>
              <p className="mb-0" style={{ whiteSpace: "pre-line" }}>
                {(currentLang === "ms" ? vocab.contohAyat : vocab.exampleSentence) ||
                  (currentLang === "ms"
                    ? "Tiada contoh ayat tersedia."
                    : "No example sentence available.")}
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VocabDetail;
