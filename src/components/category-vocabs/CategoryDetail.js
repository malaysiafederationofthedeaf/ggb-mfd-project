import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle } from "shards-react";
import { useTranslation } from "react-i18next";
import styled, { keyframes } from "styled-components";
import { zoomIn } from "react-animations";

import { Store } from "../../flux";
import { getImageWithFallback } from "../components-overview/ImgSrc";
import { COMING_SOON_IMAGE_URL } from "../../config";

const ZoomIn = styled.div`animation: .5s ${keyframes`${zoomIn}`}`;

const CategoryDetail = ({ categoryItem, group, groupKey, noOfCard }) => {
  const { i18n } = useTranslation(["word", "group-category"]);

  const isMalay = i18n.language === "ms";
  const groupFormatted = Store.formatString(groupKey);

  // Determine if this is a new sign item (has word/perkataan) or a category item (has category/kategori)
  const isNewSign = !categoryItem.category;
  const categoryFormatted = Store.formatString(categoryItem.category);

  const basePath = `/groups/${groupFormatted}`;
  const linkToPath = isNewSign
    ? `${basePath}/${encodeURIComponent(categoryItem.word)}`
    : `${basePath}/${categoryFormatted}`;

  const imgSrc = isNewSign
    ? Store.getSignImgSrc(categoryItem.perkataan)
    : Store.getCategoryImgSrc(categoryItem.kategori);
  const fallback = COMING_SOON_IMAGE_URL;
  const [bgImage, setBgImage] = useState("");

  // Determine the word to display: Word from New Sign or a Category
  const categoryWord = isNewSign
    ? isMalay
      ? categoryItem.perkataan
      : categoryItem.word
    : isMalay
    ? categoryItem.kategori
    : categoryItem.category;

  // Get the length of the word; or the longest substring if it contains space
  const length = categoryWord
    .split(" ")
    .sort((a, b) => b.length - a.length)[0].length;
  const fontSizeTemp = 30 - length;

  // To set the font size of card title dynamically
  const getFontSize = () => {
    // 1. Three cards
    if (noOfCard >= 3) {
      if (length >= 10) {
        return window.innerWidth >= 1500
          ? fontSizeTemp - 5 + "px"
          : fontSizeTemp - 4 + "px";
      } else {
        return "17px";
      }
    }
    // 2. Two cards
    else if (noOfCard === 2) {
      if (window.innerWidth > 1200) {
        return length >= 10 ? fontSizeTemp - 2 + "px" : "17px";
      } else if (window.innerWidth <= 1200 && window.innerWidth >= 875) {
        return length >= 10 ? "16px" : "18px";
      } else if (window.innerWidth >= 765) {
        return length >= 10 ? fontSizeTemp - 3 + "px" : "16px";
      } else if (window.innerWidth <= 765 && window.innerWidth >= 500) {
        return "19px";
      } else if (window.innerWidth <= 460 && window.innerWidth > 320) {
        return length >= 10 ? fontSizeTemp - 5 + "px" : "17px";
      } else {
        return "18px";
      }
    }
    // 3. One card
    else if (noOfCard === 1) {
      return "18px";
    }
    return "17px";
  };

  const [fontSize, setFontSize] = useState(getFontSize());

  // Load background image with fallback
  useEffect(() => {
    getImageWithFallback(imgSrc, fallback, (resolvedURL) => {
      setBgImage(resolvedURL);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgSrc, fallback]);

  // Update font size on resize and when the displayed word changes
  useEffect(() => {
    function handleResize() {
      setFontSize(getFontSize());
    }

    setFontSize(getFontSize());
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryWord, noOfCard]);

  return (
    <Link to={linkToPath}>
      <Card small className="card-post card-post--1">
        <ZoomIn>
          <div
            className="card-post__image"
            style={{ backgroundImage: bgImage }}
          />
        </ZoomIn>
        <CardBody>
          <CardTitle className="card-title">
            <span style={{ fontSize }}>{categoryWord}</span>
          </CardTitle>
        </CardBody>
      </Card>
    </Link>
  );
};

export default CategoryDetail;