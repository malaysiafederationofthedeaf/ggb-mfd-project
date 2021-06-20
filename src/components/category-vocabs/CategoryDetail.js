import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle } from "shards-react";
import { useTranslation } from "react-i18next";
import VocabWordPerkataan from "./VocabWordPerkataan";

import { Store } from "../../flux";

const CategoryDetail = ({ categoryItem, group }) => {
  const { t } = useTranslation("group-category");

  const groupFormatted = Store.formatString(group);
  const categoryFormatted = Store.formatString(categoryItem.category);
  const basePath = `/groups/${groupFormatted}`
  const linkToPath = categoryItem.new ? `${basePath}/${Store.formatString(categoryItem.word)}` : `${basePath}/${categoryFormatted}`;
  const imgSrc = categoryItem.new ? Store.getSignImgSrc(categoryItem.perkataan) : Store.getCategoryImgSrc(categoryItem.kategori);

  return (
    <Link to={linkToPath}>
      <Card small className="card-post card-post--1">
        <div
          className="card-post__image"
          data-aos="zoom-in"
          data-aos-delay="200"
          style={{ backgroundImage: `url('${imgSrc}')` }}
        ></div>
        <CardBody>
          <CardTitle className="card-title">
            {
              categoryItem.new
                ? <VocabWordPerkataan word={categoryItem.word} perkataan={categoryItem.perkataan} showTitleOnly={true} />
                : t(categoryFormatted)
            }
          </CardTitle>
        </CardBody>
      </Card>
    </Link>
  );
};

export default CategoryDetail;
