import React from "react";
import { Card, CardBody, Col } from "shards-react";
import { useTranslation } from "react-i18next";

const GroupDetail = ({category}) => {
    const { t } = useTranslation();

    return(
        <Col lg="6" sm="12">
            <div className="category-detail-card-wrapper">
                <a href={`/category/${category.titleEn.toLowerCase()}`}>
                <Card small className="card-post card-post--aside card-post--1">
                    <Col lg="6" md="6" sm="6">
                    <div
                        className="card-post__image"
                        data-aos="zoom-in" data-aos-delay="200"                     
                        style={{ backgroundImage: `url('${category.backgroundImage}')` }}
                    >
                    </div>
                    </Col>
                    <Col lg="6" md="6" sm="6">
                    <CardBody>
                        <h5 className="card-title">
                            {t(category.title)}
                        </h5>
                    </CardBody>
                    </Col>
                </Card>
                </a>
            </div>
        </Col>
    );
}

export default GroupDetail;
