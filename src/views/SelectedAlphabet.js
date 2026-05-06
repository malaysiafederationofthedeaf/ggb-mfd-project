import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "shards-react";
import ItemsCarousel from "react-items-carousel";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import cookies from "js-cookie";
import i18next from "i18next";

import ComingSoon from "./ComingSoon";
import PageTitle from "../components/common/PageTitle";
import { Store } from "../flux";
import AlphabetsGrid from "../components/alphabets-vocabs/AlphabetsGrid";
import AlphabetsList from "../components/alphabets-vocabs/AlphabetsList";
import { getVocabsByAlphabet, getAlphabetsList } from "../services/api/alphabetAPI";

const SelectedAlphabets = () => {
  const { alphabet } = useParams();
  const alphasFormatted = Store.formatString(alphabet);
  const alphasLists = getAlphabetsList();
  const { t } = useTranslation();
  
  const [vocabs, setVocabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [currentLang, setCurrentLang] = useState(cookies.get("i18next") || "ms");
  
  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      const newLang = cookies.get("i18next") || "ms";
      setCurrentLang(newLang);
    };
    
    i18next.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18next.off('languageChanged', handleLanguageChange);
    };
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVocabsByAlphabet(alphasFormatted);
      setVocabs(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching alphabet data:", err);
      setError(err);
      setLoading(false);
    }
  };

  // Fetch data when component mounts or alphabet/language changes
  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alphabet, alphasFormatted, currentLang]);
  
  // Show loading state
  if (loading) {
    return (
      <Container fluid className="main-content-container px-4">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">{t('Loading...')}</span>
          </div>
          <p className="mt-2">
            {t('Loading vocabulary for')} "{alphabet}"...
          </p>
        </div>
      </Container>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <Container fluid className="main-content-container px-4">
        <div className="alert alert-danger text-center">
          <p>{t("error.generic")}</p>
          <button className="btn btn-primary mt-2" onClick={fetchData}>
            {t("error.retry")}
          </button>
        </div>
      </Container>
    );
  }
  
  // return Error page if no Vocabs are returned
  if (!vocabs || vocabs.length === 0) return <ComingSoon />;

  return (
    <>
      <div className="alphabet-breadcrumbs">
        <nav className="breadcrumb d-md-none d-lg-none d-xl-none d-block">
          <ItemsCarousel
            numberOfCards={10}
            gutter={10}
            slidesToScroll={4}
            showSlither={false}
            freeScrolling={false}
            chevronWidth={30}
            rightChevron={<i className="material-icons">chevron_right</i>}
            leftChevron={<i className="material-icons">chevron_left</i>}
            requestToChangeActive={(activeItemIndex) =>
              setActiveItemIndex(activeItemIndex)
            }
            activeItemIndex={activeItemIndex}
            outsideChevron={true}
            disableSwipe={false}
          >
            {alphasLists.map((alpha) => (
              <AlphabetsGrid alphabets={alpha} key={alpha} />
            ))}
          </ItemsCarousel>
        </nav>
      </div>

      <Container
        fluid
        className="main-content-container px-4 vocab-list-wrapper"
      >
        <Row noGutters className="page-header">
          <PageTitle title={t(alphabet)} md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>
        <Row>
          <Col>
            <AlphabetsList vocabs={vocabs} alphabet={alphabet} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SelectedAlphabets;
