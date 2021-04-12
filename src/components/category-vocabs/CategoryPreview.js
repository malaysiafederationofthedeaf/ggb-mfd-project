import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
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
const CategoryPreview = ({ bimDetails }) => {
  const { t } = useTranslation();
  return (
    <Link to="/browse-by-category">
      <Card small className="h-100 m-3">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{t(bimDetails.name).toLocaleUpperCase()}</h6>
        </CardHeader>
        <CardBody className="d-flex py-0">
          <img
            className="blog-users-by-device m-auto"
            src={bimDetails.logo}
            alt={t(bimDetails.name)}
            height="180"
          />
        </CardBody>
        <CardFooter className="border-top">
          <Row>
            <Col className="text-right view-report">
              {/* eslint-disable-next-line */}
              <Button>{t("category_btn")} &rarr;</Button>
            </Col>
          </Row>
        </CardFooter>
      </Card>
    </Link>
  );
};

CategoryPreview.propTypes = {
  /**
   * The user details object.
   */
  bimDetails: PropTypes.object,
};

CategoryPreview.defaultProps = {
  bimDetails: {
    nameMalay: "BAHASA ISYARAT MALAYSIA (BIM)",
    name: "bim_name",
    logo: require("./../../images/mfd/img-logo-BIM.png"),
  },
};

export default CategoryPreview;
