import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "shards-react";
import { useTranslation } from "react-i18next";
import cookies from "js-cookie";
import { Link } from "react-router-dom";

import AboutUsPreview from "../components/about-us/AboutUsPreview";
import CategoryList from "../components/category-vocabs/CategoryList";
import FeaturedVideoList from "../components/featured-videos/FeaturedVideoList";
import SignOfTheDay from "../components/category-vocabs/SignOfTheDay";

import { getGroupItems, getCategoriesOfGroup } from "../services/api/categoryAPI";
import { getFeaturedVideos } from "../services/api/featuredVideosAPI";
import { getSignOfTheDayLightweight } from "../services/api/signOfTheDayAPI";

const newSignsCache = {};

// Preload the LCP image
const preloadLCPImage = () => {
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.as = 'image';
  preloadLink.href = '/assets/images/home-background.jpg'; 
  preloadLink.type = 'image/jpeg';
  preloadLink.fetchPriority = 'high';
  document.head.appendChild(preloadLink);
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState({});
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [signOfDay, setSignOfDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLang] = useState(cookies.get("i18next") || "ms");
  const isMalay = i18n.language === "ms";

  // Call the preload function when component mounts
  useEffect(() => {
    preloadLCPImage();
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const groupsData = await getGroupItems();
      setGroups(groupsData);

      const videosData = await getFeaturedVideos();
      setFeaturedVideos(videosData || []);

      // Fetch Sign of the Day from API or local store cache
      const sotd = await getSignOfTheDayLightweight();
      setSignOfDay(sotd);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching home page data:", err);
      setError(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, currentLang]);

  useEffect(() => {
    const lang = i18n.language;

    const fetchCategories = async () => {
      if (newSignsCache[lang]) {
        setCategories(newSignsCache[lang]);
        return;
      }

      try {
        const categoriesData = await getCategoriesOfGroup(i18n.language);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching new signs:", error);
      }
    };

    fetchCategories();
  }, [i18n.language]);


  if (loading) {
    return (
      <Container fluid>
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading content...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="main-content-container px-4">
        <Row>
          <div className="col-12 text-center p-5">
            <p className="text-danger">{t("error.generic")}</p>
            <button className="btn btn-primary mt-3" onClick={fetchAllData}>
              {t("error.retry")}
            </button>
          </div>
        </Row>
      </Container>
    );
  }

  return (
    <>
      <AboutUsPreview />
      <Container fluid>
        <div className="category-list-wrapper">
          <Row>
            {/* Only display groups with Remark="Home" */}
            {groups
              .filter(group => group.group !== "New Signs")
              .map((group) => {
                const groupName = isMalay ? group.kumpulan : group.group;
                const groupKey = group.group;
                
                return (
                  <CategoryList
                    category={categories[groupKey] ?? []}
                    group={groupName}
                    groupKey={groupKey}
                    key={groupKey}
                    className="category-list"
                  />              
                );
              })}
          </Row>
          <Row>
            {/* View all categories button */}
            <Col sm="12" md="12" lg="12" className="btn-view-all-categories">
              <Link to="/groups">{t("view_all_category_btn")} &rarr;</Link>
            </Col>
            
            {/* Only show New Signs if it has Remark="Home" */}
            {groups.some(group => group.group === "New Signs") && (
              <CategoryList
              category={categories["New Signs"] ?? []}
              group={isMalay ? "Isyarat Baru" : "New Signs"}
              groupKey="New Signs"
            />
            )}
            
            {/* Featured Videos List */}
            <FeaturedVideoList videoItems={featuredVideos}/> 

            {/* Sign of The Day */}
            {signOfDay?.word && <SignOfTheDay wordItem={signOfDay} />}
          </Row>
        </div>
      </Container>
    </>
  );
};

export default Home;
