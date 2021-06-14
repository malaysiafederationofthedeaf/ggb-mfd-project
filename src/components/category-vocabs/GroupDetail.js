import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col } from "shards-react";
import { useTranslation } from "react-i18next";

import { Store } from "../../flux";

const GroupDetail = ({ category, group }) => {
  const { t } = useTranslation("group-category");
  const categoryImgSrc = Store.getCategoryImgSrc(category.kategori);

  const groupFormatted = Store.formatString(group);
  const categoryFormatted = Store.formatString(category.category);

  return (
    <Col lg="6" sm="12">
      <div className="category-detail-card-wrapper">
        <Link to={`/groups/${groupFormatted}/${categoryFormatted}`}>
          <Card small className="card-post card-post--aside card-post--1">
            <Col lg="6" md="6" sm="6">
              <div
                className="card-post__image"
                data-aos="zoom-in"
                data-aos-delay="200"
                style={{ backgroundImage: `url('${categoryImgSrc}')` }}
              ></div>
            </Col>
            <Col lg="6" md="6" sm="6">
              <CardBody>
                <h5 className="card-title">{t(categoryFormatted)}</h5>
              </CardBody>
            </Col>
          </Card>
        </Link>
      </div>
    </Col>
  );
};

export default GroupDetail;
