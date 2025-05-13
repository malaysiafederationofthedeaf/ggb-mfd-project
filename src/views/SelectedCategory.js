import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "shards-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import cookies from "js-cookie";
import i18next from "i18next";

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

  const { t, i18n } = useTranslation("group-category"); // Add i18n here
  const [currentLang, setCurrentLang] = useState(cookies.get("i18next") || "ms");
  const isMalay = i18n.language === "ms"; // Add this line to check language

  const categoryFormatted = Store.formatString(categoryEng);
  const groupFormatted = Store.formatString(group);
  
  // Declare all state variables first
  const [localizedTitle, setLocalizedTitle] = useState("");
  const [vocabs, setVocabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      const newLang = cookies.get("i18next") || "ms";
      if (newLang !== currentLang) {
        setCurrentLang(newLang);
        // Force re-render when language changes
        if (!window.location.pathname.includes('/alphabets/') && 
            !window.location.pathname.includes('/category/')) {
          // If we're not on a page that will reload, force a re-render
          setLoading(true);
          setTimeout(() => setLoading(false), 10);
        }
      }
    };
    
    i18next.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18next.off('languageChanged', handleLanguageChange);
    };
  }, [currentLang]);
  
  // Fetch data when component mounts or group/category/language changes
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
  }, [groupSelected, categoryFormatted, isNewSignCategory, currentLang]);
  
  // Fetch category data for localization - MOVED AFTER vocabs is initialized
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // For "New Signs" we can use the API data
        if (isNewSignCategory) {
          setLocalizedTitle(isMalay ? "Isyarat Baru" : "New Signs");
          return;
        }
        
        // For regular categories, try to get the localized name from the first vocab item
        if (vocabs && vocabs.length > 0) {
          // Extract group/category information from the first item
          const firstItem = vocabs[0];
          
          if (isMalay && firstItem.kumpulanKategori) {
            // For Malay, use the KumpulanKategori field
            const parts = firstItem.kumpulanKategori.split('/');
            if (parts.length >= 2) {
              // Use the second part (category name)
              setLocalizedTitle(parts[1].trim());
              console.log(`Set Malay title from API: ${parts[1].trim()}`);
              return;
            }
          } else if (!isMalay && firstItem.groupCategory) {
            // For English, use the GroupCategory field
            const parts = firstItem.groupCategory.split('/');
            if (parts.length >= 2) {
              // Use the second part (category name)
              setLocalizedTitle(parts[1].trim());
              console.log(`Set English title from API: ${parts[1].trim()}`);
              return;
            }
          }
        }
        
        // Fallback: Simple capitalization function
        const capitalize = (str) => {
          if (!str) return '';
          return str.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        };
        
        // If we couldn't get the title from API data, use the URL parameter
        setLocalizedTitle(capitalize(categoryEng));
        console.log(`Set fallback title: ${capitalize(categoryEng)}`);
        
      } catch (err) {
        console.error("Error setting localized title:", err);
        // Fallback to category name as-is
        setLocalizedTitle(categoryEng);
      }
    };
    
    fetchCategoryData();
  }, [isMalay, isNewSignCategory, categoryEng, vocabs]);
  
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
            title={localizedTitle} // Use the state variable
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
