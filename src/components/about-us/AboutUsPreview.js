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

const AboutUsPreview = ({ mfdDetails }) => (
  <Link to="/about-us">
    <Card small className="h-100 m-3">
      <CardHeader className="border-bottom">
        <h6 className="m-0">{mfdDetails.nameMalay}</h6>
      </CardHeader>
      <CardBody className="d-flex py-0">
        <img
          className="blog-users-by-device m-auto"
          src={mfdDetails.logo}
          alt={mfdDetails.name}
          height="180"
        />
      </CardBody>
      <CardFooter className="border-top">
        <Row>
          <Col className="text-right view-report">
            {/* eslint-disable-next-line */}
            <Button>Pengenalan/ About Us &rarr;</Button>
          </Col>
        </Row>
      </CardFooter>
    </Card>
  </Link>
);

AboutUsPreview.propTypes = {
  /**
   * The user details object.
   */
  mfdDetails: PropTypes.object,
};

AboutUsPreview.defaultProps = {
  mfdDetails: {
    nameMalay: "PERSATUAN ORANG PEKAK MALAYSIA",
    name: "MALAYSIAN FEDERATION OF THE DEAF (MFD)",
    logo: require("./../../images/mfd/mfd-logo.jpg"),
  },
};

export default AboutUsPreview;
