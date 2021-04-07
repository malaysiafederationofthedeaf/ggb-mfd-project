import React from "react";
import PropTypes from "prop-types";
import logo from"../../images/img-logo-MFD.jpg" 
import {
  Card,
  CardHeader,
  CardBody,
  CardImg,
  Container,
  Row,
  Col
} from "shards-react";

const AboutUs = ({ title }) => (
  <Card small className="h-100">
    {/* Card Header */}
    <CardHeader className="border-bottom">
      <h6 className="m-0">{title}</h6>
    </CardHeader>

    <CardBody className="d-flex flex-column">
      <Container>
        <Row>
          <Col >
            <CardImg src={logo} className="card-img"/>
          </Col>
          <Col >
            <p className="text-dark font-weight-bold mb-0">PERSEKUTUAN ORANG PEKAK MALAYSIA /</p>
            <p className="text-dark font-weight-bold mb-2">MALAYSIAN FEDERATION OF DEAF (MFD)</p>
            <p className="mb-0">ialah sebuah organisasi peringkat kebangsaan yang memayungi Persatuan Orang Pekak di Malaysia</p>
          </Col>
        </Row>
      </Container>
    </CardBody>
  </Card>
);

AboutUs.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string
};

AboutUs.defaultProps = {
  title: "New Draft"
};

export default AboutUs;
