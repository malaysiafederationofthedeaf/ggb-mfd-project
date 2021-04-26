import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle } from "shards-react";
import { useTranslation } from "react-i18next";

const CategoryDetail = ({ categoryItem }) => {
  const { t } = useTranslation();
  return (
    <Link to={`/category/${categoryItem.titleEn.toLowerCase()}`}>
      <Card
        small
        className="card-post card-post--1"
        key={t(categoryItem.title)}
      >
        <div
          className="card-post__image"
          data-aos="zoom-in" data-aos-delay="200"          
          style={{ backgroundImage: `url(${categoryItem.backgroundImage})` }}
        ></div>
        <CardBody>
          <CardTitle className="card-title">
            {t(categoryItem.title)}
          </CardTitle>
        </CardBody>
      </Card>
    </Link>
  );
};

export default CategoryDetail;
