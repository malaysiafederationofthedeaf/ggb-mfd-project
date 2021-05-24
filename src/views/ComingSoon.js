import React from "react";
import { Container } from "shards-react";

import BackButton from "../components/common/BackButton";

const ComingSoon = () => (
  <Container fluid className="main-content-container px-4 pb-4">
    <div className="error">
      <div className="error__content">
        <h1>Coming Soon</h1>
        <h2>Stay tuned! </h2>
        <p>New content is around the corner.</p>
        <BackButton />
      </div>
    </div>
  </Container>
);

export default ComingSoon;
