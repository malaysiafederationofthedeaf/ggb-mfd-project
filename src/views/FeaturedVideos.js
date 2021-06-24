import React from "react";
import { Container, Row } from "shards-react";
import { useTranslation } from "react-i18next";

import FeaturedVideoFrame from "../components/featured-videos/FeaturedVideoFrame";
import { Store } from "../flux";

const FeaturedVideos = () => {
  const { t } = useTranslation();
  return (
    <div className="category-list-wrapper">
      <Container fluid className="main-content-container">
        <Row>
          <h1>{t("featured_videos")}</h1>
        </Row>
        {Store.getFeaturedVideosList().map((video, key) => (
          <FeaturedVideoFrame video={video} key={key} id={video}/>
        ))}
      </Container>
    </div>
  );
}

export default FeaturedVideos;
