import React from "react";
import { Card, CardBody, CardTitle } from "shards-react";
import { useTranslation } from "react-i18next";

const CategoryDetail = ({ categoryItem }) => {
  const { t } = useTranslation();
  return (
    <a href={`/category/${categoryItem.titleEn.toLowerCase()}`}>
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
    </a>
  );
};

export default CategoryDetail;
