import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "shards-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import ComingSoon from "./ComingSoon";
import PageTitle from "../components/common/PageTitle";
import VocabList from "../components/category-vocabs/VocabList";
import { Store } from "../flux";
import Breadcrumbs from "../components/layout/Breadcrumbs/Breadcrumbs";
import { getVocabsByCategory, getNewSigns } from "../services/api/selectcategoryapi";

const SelectedCategory = () => {
  const { group, category } = useParams();
  const pathTail = window.location.pathname.split("/").pop();
  const isNewSignCategory = pathTail === "new-signs"; // for new-sign category
  const groupSelected = isNewSignCategory ? pathTail : group;
  const categoryEng = category;

  const { t } = useTranslation("group-category");

  const categoryFormatted = Store.formatString(categoryEng);
  const groupFormatted = Store.formatString(group);
  const title = isNewSignCategory ? groupFormatted : categoryFormatted;
  
  const [vocabs, setVocabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch data when component mounts or group/category changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let data;
        if (isNewSignCategory) {
          console.log("Fetching new signs data");
          data = await getNewSigns();
        } else {
          console.log(`Fetching data for group/category: ${groupSelected}/${categoryFormatted}`);
          data = await getVocabsByCategory(groupSelected, categoryFormatted);
        }
        
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
  }, [groupSelected, categoryFormatted, isNewSignCategory]);
  
  // Show loading state
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
  
  // Show error state
  if (error) {
    return (
      <Container fluid className="main-content-container px-4">
        <div className="alert alert-danger">
          Error loading data: {error.message}
        </div>
      </Container>
    );
  }
  
  // return Error page if no Vocabs are returned
  if (!vocabs || vocabs.length === 0) return <ComingSoon />;

  return (
    <>
      <Breadcrumbs />
      <Container
        fluid
        className="main-content-container px-4 vocab-list-wrapper"
      >
        <Row noGutters className="page-header">
          <PageTitle
            title={t(title)}
            md="12"
            className="ml-sm-auto mr-sm-auto"
          />
        </Row>
        <Row>
          <Col>
            <VocabList vocabs={vocabs} group={groupSelected} category={categoryEng}/>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SelectedCategory;
