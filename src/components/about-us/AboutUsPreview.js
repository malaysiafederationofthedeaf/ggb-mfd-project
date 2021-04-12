import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Col,
  Row,
} from "shards-react";
import { useTranslation } from "react-i18next";
const AboutUsPreview = ({ mfdDetails }) => {
  const { t } = useTranslation();
  return (
    <Link to="/about-us">
      <Card small className="h-100 m-3">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{t(mfdDetails.name).toLocaleUpperCase()}</h6>
        </CardHeader>
        <CardBody className="d-flex py-0">
          <img
            className="blog-users-by-device m-auto"
            src={mfdDetails.logo}
            alt={t(mfdDetails.name)}
            height="180"
          />
        </CardBody>
        <CardFooter className="border-top">
          <Row>
            <Col className="text-right view-report">
              {/* eslint-disable-next-line */}
              <Button>{t("about_us_btn")} &rarr;</Button>
            </Col>
          </Row>
        </CardFooter>
      </Card>
    </Link>
  );
};

AboutUsPreview.propTypes = {
  /**
   * The user details object.
   */
  mfdDetails: PropTypes.object,
};

AboutUsPreview.defaultProps = {
  mfdDetails: {
    nameMalay: "PERSATUAN ORANG PEKAK MALAYSIA",
    name: "mfd_name",
    logo: require("./../../images/mfd/mfd-logo.jpg"),
  },
};

export default AboutUsPreview;
