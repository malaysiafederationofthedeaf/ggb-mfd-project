import React from "react";
import PropTypes from "prop-types";

import { Container, Row, Col } from "shards-react";

const AboutUsDetails = ({ mfdDetails, t }) => (
  <div className="about-us d-flex align-items-center">
    <Container>
      <Row>
        <Col lg="6" className="d-flex flex-column justify-content-center">
          <h1 data-aos="fade-up">{t(mfdDetails.name)}</h1>  
          <p data-aos="fade-up" data-aos-delay="400">{t(mfdDetails.metaValue1)}</p>         
          <p data-aos="fade-up" data-aos-delay="500">{t(mfdDetails.metaValue2)}</p> 
        </Col>
        <Col lg="6" className="about-us-img" data-aos="zoom-out" data-aos-delay="200">
          <img src={mfdDetails.logo} alt={t(mfdDetails.name)}className="img-fluid"/>
        </Col>
      </Row>     
    </Container>
  </div> 
);

AboutUsDetails.propTypes = {
  /**
   * The user details object.
   */
  mfdDetails: PropTypes.object,
};

AboutUsDetails.defaultProps = {
  mfdDetails: {
    name: "mfd_name",
    logo: require("./../../images/mfd/mfd-about.jpg"),
    metaTitle: "meta_title",
    metaValue1: "meta_value_1",
    metaValue2: "meta_value_2",
  },
};

export default AboutUsDetails;
