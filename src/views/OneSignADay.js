import React from "react";
import { Container, Row } from "shards-react";
import { useTranslation } from "react-i18next";
import { Store } from "../flux";
import OneSignADayVideoFrame from "../components/one-sign-a-day/OneSignADayVideoFrame";


const OneSignADay = () => {
  const { t } = useTranslation();
  const fbVideos = Store.getFacebookVideosList();
  return (
    <div className="category-list-wrapper">
      <Container fluid className="main-content-container">
        <Row className="p-4">
          <section>
            <h1 className="facebook-detail-video-header">
              {t("one_sign_a_day")}
            </h1>
          </section>
        </Row>

        {fbVideos.map((video) => (
          <OneSignADayVideoFrame video={video} key={video.id}/>
        ))}
      </Container>
    </div>
  );
};

export default OneSignADay;
