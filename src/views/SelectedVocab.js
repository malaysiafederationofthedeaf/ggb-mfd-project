import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody } from "shards-react";
import { useTranslation } from "react-i18next";
import cookies from "js-cookie";
import i18next from "i18next";

import WordNotFound from "./WordNotFound";
import VocabDetail from "../components/category-vocabs/VocabDetail";
import Breadcrumbs from "../components/layout/Breadcrumbs/Breadcrumbs";
import { getVocabDetail, findSimilarWords } from "../services/api/vocabAPI";
import { convertToUrlFormat } from "../utils/urlFormat";

const SelectedVocab = () => {
  const { vocab } = useParams();
  const decodedVocab = decodeURIComponent(vocab);
  const [categoryVocab, setCategoryVocab] = useState(null);
  const [vocabDetails, setVocabDetails] = useState(null);
  const [similarWords, setSimilarWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
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

  // Fetch data when component mounts or vocab/language changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getVocabDetail(decodedVocab);

        if (data) {
          setCategoryVocab(data);
          setVocabDetails(data[0]);
          setLoading(false);

          // Use the localized word based on current language for finding similar words
          const localizedWord = currentLang === "ms" ? data[0].perkataan : data[0].word;

          // Process similar words asynchronously without blocking the UI
          findSimilarWords(localizedWord, 5)
            .then(similar => setSimilarWords(similar))
            .catch(console.error);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching vocab data:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [vocab, decodedVocab, currentLang]);

  // Show loading state
  if (loading) {
    return (
      <Container fluid className="main-content-container px-4">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Loading details for "{vocab}"...</p>
        </div>
      </Container>
    );
  }

  // Show error state or a friendly message for invalid/missing vocab URLs
  if (error || !categoryVocab || categoryVocab.length === 0) {
    return <WordNotFound />;
  }

  return (
    <>
      <div className="breadcrumbs-selected-vocab">
        <Breadcrumbs vocab={categoryVocab} />
      </div>
      <Container
        fluid
        className="main-content-container vocab-list-wrapper"
      >
        <VocabDetail vocab={vocabDetails} currentLang={currentLang} />
        
        {/* Similar Words Section */}
        {similarWords.length > 0 && (
          <Card className="mt-4">
            <CardBody>
              <h4>{currentLang === "ms" ? "Lihat Juga" : "See Also"}</h4>
              <Row>
                {similarWords.map((word) => {
                  // Determine the correct routing based on the word's category/group
                  let routePath;

                  // If the word has category information, use the group/category route
                  if (word.groupCategory && word.groupCategory.includes('/')) {
                    const [group, category] = word.groupCategory.split('/').map(convertToUrlFormat);
                    routePath = `/groups/${group}/${category}/${encodeURIComponent(word.word)}`;
                  } else {
                    // Default to alphabet route if no category info
                    routePath = `/alphabets/${word.word.charAt(0).toLowerCase()}/${encodeURIComponent(word.word)}`;
                  }

                  return (
                    <Col key={word.word} md={4} sm={6} className="mb-3">
                      <Link
                        to={routePath}
                        className="similar-word-link"
                      >
                        {currentLang === "ms" ? word.perkataan : word.word}
                      </Link>
                    </Col>
                  );
                })}
              </Row>
            </CardBody>
          </Card>
        )}
      </Container>
    </>
  );
};

export default SelectedVocab;
