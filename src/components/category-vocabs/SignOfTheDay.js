import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col } from "shards-react";
import { useTranslation } from "react-i18next";
import { HashLink } from 'react-router-hash-link';
import styled, { keyframes } from 'styled-components';
import { zoomIn } from 'react-animations';

import PageTitle from "../common/PageTitle";
import { Store } from "../../flux";
import VocabWordPerkataan from "./VocabWordPerkataan";

const ZoomIn = styled.div`animation: .5s ${keyframes `${zoomIn}`}`;

const SignOfTheDay = ({wordItem}) => {
    const groupCat = wordItem.groupCategory.toString().includes(",") ? 
        wordItem.groupCategory.toString().substring(0, wordItem.groupCategory.indexOf(",")) : // get the first group&category pair if there are multiple group&category pairs
        wordItem.groupCategory.toString();
    const linkToPath = "groups/"+Store.formatGroupCategory(groupCat)+"/"+Store.formatString(wordItem.word);
    const imgSrc = Store.getSignImgSrc(wordItem.perkataan);

    const { t } = useTranslation(["", "word"]);

    return (
        <Col sm="12" md="6" lg="6" xl="4" id="sotd">
            <div className="sotd-card-wrapper">                
            <HashLink smooth to={`/home#sotd`}>
                <PageTitle title={t("sign_of_the_day")} />
                </HashLink>
                <Link to={linkToPath}>
                    <Card small className="card-post card-post--aside card-post--1">
                        <Col lg="6" md="6" sm="6">
                        <ZoomIn className="card-post__image-wrapper">
                            <img
                                src={imgSrc}
                                alt={wordItem.word}
                                className="card-post__image"
                            />                            
                        </ZoomIn>
                        </Col>
                        <Col lg="6" md="6" sm="6">
                            <CardBody className="card-title">
                                <VocabWordPerkataan word={wordItem.word} perkataan={wordItem.perkataan} />
                            </CardBody>
                        </Col>
                    </Card>                    
                </Link>
            </div>
        </Col>
    );
};

export default SignOfTheDay;
