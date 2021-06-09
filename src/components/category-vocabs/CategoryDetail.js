import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle } from "shards-react";
import { useTranslation } from "react-i18next";

import { Store } from "../../flux";

const CategoryDetail = ({ categoryItem, group }) => {
  const { t } = useTranslation("group-category");
  const categoryImgSrc = Store.getCategoryImgSrc(categoryItem.kategori);

  const groupFormatted = Store.formatString(group);
  const categoryFormatted = Store.formatString(categoryItem.category);

  return (
    <Link to={`/groups/${groupFormatted}/${categoryFormatted}`}>
      <Card small className="card-post card-post--1">
        <div
          className="card-post__image"
          data-aos="zoom-in"
          data-aos-delay="200"
          style={{ backgroundImage: `url('${categoryImgSrc}')` }}
        ></div>
        <CardBody>
          <CardTitle className="card-title">{t(categoryFormatted)}</CardTitle>
        </CardBody>
      </Card>
    </Link>
  );
};

export default CategoryDetail;
