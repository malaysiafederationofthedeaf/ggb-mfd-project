import React from "react";
import { Card, CardBody, CardTitle } from "shards-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CategoryDetail = ({ categoryItem }) => {
  const { t } = useTranslation();
  return (
    <Link to={`/category/${t(categoryItem.title)}`}>
      <Card
        small
        className="card-post card-post--1"
        key={t(categoryItem.title)}
      >
        <div
          className="card-post__image"
          style={{ backgroundImage: `url(${categoryItem.backgroundImage})` }}
        ></div>
        <CardBody>
          <CardTitle style={{ height: "50px" }}>
            {t(categoryItem.title)}
          </CardTitle>
        </CardBody>
      </Card>
    </Link>
  );
};

export default CategoryDetail;
