import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, Col } from "shards-react";
import { useTranslation } from "react-i18next";
import PageTitle from "../common/PageTitle";
import ReactPlayer from 'react-player';
import { HashLink } from 'react-router-hash-link';
import { Store } from "../../flux";

const OneSignADayCard = () => {
  const { t } = useTranslation();
  const latestVideo = Store.getLatestFacebookVideo() || {};

  console.log(latestVideo);
  return (
    <Col sm="12" md="6" lg="6" xl="4">
      <div className="facebook-card-wrapper">
        <Link to={`/one-sign-a-day`}>
          <PageTitle title={t("one_sign_a_day")} />
        </Link>
        <HashLink smooth to={`/one-sign-a-day`}>
          <Card small className="card-post card-post--1">
              <CardBody>
                <div className="facebook-player-wrapper">                  
                  <ReactPlayer className="facebook-player" url={latestVideo.url} playing={false} controls={true} loop={true} />
                </div>
                <CardTitle className="card-title-featured-video">
                  {latestVideo.title}
                </CardTitle>                
              </CardBody>
          </Card>
        </HashLink>
      </div>
    </Col>
  );
};

export default OneSignADayCard;
