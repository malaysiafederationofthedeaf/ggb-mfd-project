import React from "react";
import { Link } from "react-router-dom";
import { Col } from "shards-react";

const AlphabetsGrid = ({ alphabets }) => {
  return (
    <Col xs={4} md={3} lg={2}>
      <h2>
        <Link to={`/alphabets/${alphabets}`} className="text-decoration-none">
          {alphabets.toUpperCase()}
        </Link>
      </h2>
    </Col>
  );
};

export default AlphabetsGrid;
