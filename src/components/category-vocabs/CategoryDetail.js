import React from "react";
import { Card, CardBody, CardTitle, CardSubtitle } from "shards-react";
import { Link } from "react-router-dom";

const CategoryDetail = ({ categoryItem }) => (
  <Link to={`/category/${categoryItem.title.toLowerCase()}`}>
    <Card small className="card-post card-post--1" key={categoryItem.title}>
      <div
        className="card-post__image"
        style={{ backgroundImage: `url(${categoryItem.backgroundImage})` }}
      ></div>
      <CardBody>
        <CardTitle style={{ height: "50px" }}>
          {categoryItem.titleMalay}
        </CardTitle>
        <CardSubtitle>{categoryItem.title}</CardSubtitle>
      </CardBody>
    </Card>
  </Link>
);

export default CategoryDetail;
