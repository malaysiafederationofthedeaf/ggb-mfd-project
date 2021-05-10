import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle } from "shards-react";
import { useTranslation } from "react-i18next";

import { Store } from "../../flux";

const CategoryDetail = ({ categoryItem, group }) => {
  const { t } = useTranslation();
  const categoryImgSrc = Store.getCategoryImgSrc(categoryItem.titleMalay);

  return (
    <Link to={`/${group.toLowerCase()}/${categoryItem.title.toLowerCase()}`}>
      <Card
        small
        className="card-post card-post--1"
        key={t(categoryItem.title)}
      >
        <div
          className="card-post__image"
          data-aos="zoom-in" data-aos-delay="200"          
          style={{ backgroundImage: `url(${categoryImgSrc})` }}
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
