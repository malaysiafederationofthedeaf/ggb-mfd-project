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

const CategoryPreview = ({ bimDetails }) => (
  <Link to="/browse-by-category">
    <Card small className="h-100 m-3">
      <CardHeader className="border-bottom">
        <h6 className="m-0">{bimDetails.nameMalay}</h6>
      </CardHeader>
      <CardBody className="d-flex py-0">
        <img
          className="blog-users-by-device m-auto"
          src={bimDetails.logo}
          alt={bimDetails.name}
          height="180"
        />
      </CardBody>
      <CardFooter className="border-top">
        <Row>
          <Col className="text-right view-report">
            {/* eslint-disable-next-line */}
            <Button>Kategori-Kategori BIM/ BIM Categories &rarr;</Button>
          </Col>
        </Row>
      </CardFooter>
    </Card>
  </Link>
);

CategoryPreview.propTypes = {
  /**
   * The user details object.
   */
  bimDetails: PropTypes.object,
};

CategoryPreview.defaultProps = {
  bimDetails: {
    nameMalay: "BAHASA ISYARAT MALAYSIA (BIM)",
    name: "MALAYSIA SIGN LANGUAGE",
    logo: require("./../../images/mfd/img-logo-BIM.png"),
  },
};

export default CategoryPreview;
