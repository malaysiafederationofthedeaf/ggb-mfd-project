import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle } from "shards-react";
import { useTranslation } from "react-i18next";
import styled, { keyframes } from 'styled-components';
import { zoomIn } from 'react-animations';

import { Store } from "../../flux";

const CategoryDetail = ({ categoryItem, group }) => {
  const { t } = useTranslation("group-category");
  const categoryImgSrc = Store.getCategoryImgSrc(categoryItem.kategori);

  const groupFormatted = Store.formatString(group);
  const categoryFormatted = Store.formatString(categoryItem.category);

  const ZoomIn = styled.div`animation: .5s ${keyframes `${zoomIn}`}`;  

  return (
    <Link to={`/groups/${groupFormatted}/${categoryFormatted}`}>
      <Card small className="card-post card-post--1">
        <ZoomIn>
          <div
            className="card-post__image"
            style={{ backgroundImage: `url('${categoryImgSrc}')` }}
          ></div>
        </ZoomIn>
        <CardBody>
          <CardTitle className="card-title">{t(categoryFormatted)}</CardTitle>
        </CardBody>
      </Card>
    </Link>
  );
};

export default CategoryDetail;
