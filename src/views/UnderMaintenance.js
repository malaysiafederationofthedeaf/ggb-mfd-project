import React from "react";
import { Container } from "shards-react";

import BackButton from "../components/common/BackButton";
import ToolsIcon from "../images/general/icon/tools-maintenance-icon";

const UnderMaintenance = () => (
  <Container fluid className="main-content-container px-4 pb-4">
    <div className="error">
      <div className="error__content">
        <ToolsIcon height={150} width={150} />
        <h1>Under Maintenance</h1>
        <h2>We'll be back!</h2>
        <p>
          The site is currently under maintenance. Please visit again later.
        </p>
        <BackButton />
      </div>
    </div>
  </Container>
);

export default UnderMaintenance;
