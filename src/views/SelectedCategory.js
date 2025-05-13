import React, { useState, useEffect, useMemo } from "react";
import { Container, Col, Row } from "shards-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import i18next from "i18next";

import ComingSoon from "./ComingSoon";
import PageTitle from "../components/common/PageTitle";
import VocabList from "../components/category-vocabs/VocabList";
import { Store } from "../flux";
import Breadcrumbs from "../components/layout/Breadcrumbs/Breadcrumbs";
import { getVocabsByCategory, getNewSigns } from "../services/api/selectcategoryapi";

// Capitalize helper
const capitalize = (str) =>
  str?.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const SelectedCategory = () => {
  const { group, category } = useParams();
  const categoryEng = decodeURIComponent(category); // fix for encoded URLs
  const pathTail = window.location.pathname.split("/").pop();
  const isNewSignCategory = pathTail === "new-signs";
  const groupSelected = isNewSignCategory ? pathTail : group;

  const { t, i18n } = useTranslation("group-category");
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const isMalay = currentLang === "ms";

  //const groupFormatted = useMemo(() => Store.formatString(group), [group]);
  const categoryFormatted = useMemo(() => Store.formatString(categoryEng), [categoryEng]);

  const [localizedTitle, setLocalizedTitle] = useState("");
  const [vocabs, setVocabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setCurrentLang(lng);
      if (!window.location.pathname.includes("/alphabets/") &&
          !window.location.pathname.includes("/category/")) {
        setLoading(true);
        setTimeout(() => setLoading(false), 10);
      }
    };

    i18next.on("languageChanged", handleLanguageChange);
    return () => {
      i18next.off("languageChanged", handleLanguageChange);
    };
  }, []);

  // Fetch vocab data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = isNewSignCategory
          ? await getNewSigns()
          : await getVocabsByCategory(groupSelected, categoryFormatted);

        console.log(`Received ${data.length} items for ${isNewSignCategory ? "new signs" : `${groupSelected}/${categoryFormatted}`}`);
        setVocabs(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching category data:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [groupSelected, categoryFormatted, isNewSignCategory, currentLang]);

  // Set localized title
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        if (isNewSignCategory) {
          setLocalizedTitle(isMalay ? "Isyarat Baru" : "New Signs");
          return;
        }

        if (vocabs?.length > 0) {
          const firstItem = vocabs[0];
          const categoryPath = isMalay ? firstItem.kumpulanKategori : firstItem.groupCategory;

          if (categoryPath) {
            const parts = categoryPath.split("/");
            if (parts.length >= 2) {
              setLocalizedTitle(parts[1].trim());
              return;
            }
          }
        }

        // Fallback to URL param
        setLocalizedTitle(capitalize(categoryEng));
      } catch (err) {
        console.error("Error setting localized title:", err);
        setLocalizedTitle(categoryEng);
      }
    };

    fetchCategoryData();
  }, [isMalay, isNewSignCategory, categoryEng, vocabs]);

  // Render loading state
  if (loading) {
    return (
      <Container fluid className="main-content-container px-4">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">
            Loading {isNewSignCategory ? "new signs" : `vocabulary for "${categoryEng}"`}...
          </p>
        </div>
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container fluid className="main-content-container px-4">
        <div className="alert alert-danger">
          {t("errorLoadingData")}: {error.message}
        </div>
      </Container>
    );
  }

  // Render coming soon if no data
  if (!vocabs || vocabs.length === 0) return <ComingSoon />;

  // Render page
  return (
    <>
      <Breadcrumbs />
      <Container fluid className="main-content-container px-4 vocab-list-wrapper">
        <Row noGutters className="page-header">
          <PageTitle
            title={localizedTitle}
            md="12"
            className="ml-sm-auto mr-sm-auto"
          />
        </Row>
        <Row>
          <Col>
            <VocabList vocabs={vocabs} group={groupSelected} category={categoryEng} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SelectedCategory;
