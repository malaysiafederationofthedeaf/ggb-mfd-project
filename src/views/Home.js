import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "shards-react";
import { useTranslation } from "react-i18next";
import cookies from "js-cookie";
import { Link } from "react-router-dom";

import AboutUsPreview from "../components/about-us/AboutUsPreview";
import CategoryList from "../components/category-vocabs/CategoryList";
import FeaturedVideoList from "../components/featured-videos/FeaturedVideoList";
import SignOfTheDay from "../components/category-vocabs/SignOfTheDay";

import { Store } from "../flux";
import { getGroupItems, getCategoriesOfGroup } from "../services/api/categoryAPI";
import { getFeaturedVideos } from "../services/api/featuredVideosAPI";
import { getNewSigns } from "../services/api/alphabetAPI";

const Home = () => {
  const { t, i18n } = useTranslation();
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState({});
  const [newSigns, setNewSigns] = useState([]);
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [signOfDay, setSignOfDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLang] = useState(cookies.get("i18next") || "ms");
  const isMalay = i18n.language === "ms";

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const groupsData = await getGroupItems();
        const filteredGroups = groupsData.filter((group) => group?.group);
        setGroups(filteredGroups);

        const categoriesData = await getCategoriesOfGroup();
        setCategories(categoriesData);

        const newSignsData = await getNewSigns();
        setNewSigns(newSignsData);

        const videosData = await getFeaturedVideos();
        setFeaturedVideos(videosData || []);

        setSignOfDay(Store.getSignOfTheDay());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching home page data:", error);

        setGroups(Store.getGroupsHome().filter((group) => group?.group));
        setCategories({});
        setNewSigns([]);
        setFeaturedVideos(Store.getFeaturedVideosList());
        setSignOfDay(Store.getSignOfTheDay());
        setLoading(false);
      }
    };

    fetchAllData();
  }, [currentLang]);

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

  return (
    <>
      <AboutUsPreview />
      <Container fluid>
        <div className="category-list-wrapper">
          <Row>
            {/* Top Sign Groups to be displayed in Home Page */}
            {groups
              .filter(group => group.group !== "New Signs")
              .map((group, key) => {
                const groupName = isMalay ? group.kumpulan : group.group;
                const groupKey = group.group; // Pass group in Eng version
                
                return (
                  <CategoryList
                    category={categories[groupKey] || Store.getCategoriesOfGroup(groupKey)}
                    group={groupName}
                    groupKey={groupKey}
                    key={key}
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
            
            {/* New Signs Category */}
            <CategoryList
              category={categories["New Signs"] || Store.getCategoriesOfGroup("New Signs")}
              group={isMalay ? "Isyarat Baru" : "New Signs"}
              groupKey="New Signs"
            />
            
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
