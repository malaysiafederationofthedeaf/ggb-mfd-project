import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col } from "shards-react";
import { useTranslation } from "react-i18next";
import styled, { keyframes } from 'styled-components';
import { zoomIn } from 'react-animations';

import { Store } from "../../flux";
import LazyImage from "../common/LazyImage";

const ZoomIn = styled.div`animation: .5s ${keyframes`${zoomIn}`}`;

const GroupDetail = ({ category, group }) => {
  const { t, i18n } = useTranslation("group-category");
  const categoryImgSrc = Store.getCategoryImgSrc(category.kategori);
  const fallback = `https://pub-53c2a4aa4b544b0fb5ca676a1f4675e0.r2.dev/images/bim/coming-soon.avif`;
  const isMalay = i18n.language === "ms";

  const groupFormatted = Store.formatString(group);
  const categoryFormatted = Store.formatString(category.category);
  const basePath = `/groups/${groupFormatted}`

  return (
    <Col lg="6" sm="12">
      <div className="category-detail-card-wrapper">
        <Link to={`${basePath}/${categoryFormatted}`}>
          <Card small className="card-post card-post--aside card-post--1">
            <Col xs="4" lg="6" md="6" sm="6">
              <ZoomIn>
                <LazyImage
                  className="card-post__image"
                  src={categoryImgSrc}
                  alt={category.category}
                  fallback={fallback}
                  style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
                />
              </ZoomIn>
            </Col>
            <Col xs="8" lg="6" md="6" sm="6">
              <CardBody>
                <h5 className="card-title-2">{t(isMalay ? category.kategori : category.category)}</h5>
              </CardBody>
            </Col>
          </Card>
        </Link>
      </div>
    </Col>
  );
};

export default GroupDetail;