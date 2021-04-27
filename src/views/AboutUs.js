import React from "react";
import { Container } from "shards-react";
import { useTranslation } from "react-i18next";

import AboutUsDetails from "../components/about-us/AboutUsDetails";

const AboutUs = () => {
  const { t } = useTranslation();
  return (
    <Container fluid className="main-content-container px-4">
      <AboutUsDetails t={t} />
    </Container>
  );
};

export default AboutUs;
