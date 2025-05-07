import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Container } from "shards-react";

import ComingSoon from "./ComingSoon";
import VocabDetail from "../components/category-vocabs/VocabDetail";
import Breadcrumbs from "../components/layout/Breadcrumbs/Breadcrumbs";
import { getVocabDetail } from "../services/api/vocabAPI";

const SelectedVocab = () => {
  const { vocab } = useParams();
  const [categoryVocab, setCategoryVocab] = useState(null);
  const [vocabDetails, setVocabDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch data when component mounts or vocab changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`Fetching data for vocab: ${vocab}`);
        const data = await getVocabDetail(vocab);
        
        if (data) {
          setCategoryVocab(data);
          setVocabDetails(data[0]);
          console.log(`Received vocab details for: ${vocab}`);
        } else {
          console.log(`No data found for vocab: ${vocab}`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching vocab data:", err);
        setError(err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [vocab]);
  
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
  
  // return Error page if no Vocab Details are returned
  if (!categoryVocab) return <ComingSoon />;

  return (
    <>
      <div className="breadcrumbs-selected-vocab">
        <Breadcrumbs vocab={categoryVocab} />
      </div>
      <Container
        fluid
        className="main-content-container vocab-list-wrapper"
      >
        <VocabDetail vocab={vocabDetails} />
      </Container>
    </>
  );
};

export default SelectedVocab;
