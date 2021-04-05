import React from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import AboutUsDetails from "../components/about-us/AboutUsDetails";

const AboutUs = () => (
  <Container fluid className="main-content-container px-4">
    <Row noGutters className="page-header py-4">
      <PageTitle title="Pengenalan" subtitle="ABOUT US" md="12" className="ml-sm-auto mr-sm-auto" />
    </Row>
    <Row>
      <Col>
        <AboutUsDetails />
      </Col>
    </Row>
  </Container>
);

export default AboutUs;
