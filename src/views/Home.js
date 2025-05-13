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
  const { t } = useTranslation();
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState({});
  const [newSigns, setNewSigns] = useState([]);
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [signOfDay, setSignOfDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLang] = useState(cookies.get("i18next") || "ms");

  // Helper to format group name into URL slug
  const formatGroupName = (name) =>
    name?.toLowerCase().replace(/\s+/g, "-");

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
          {groups
            .filter((group) => group.group !== "New Signs")
            .map((group, index) => (
              <div key={index} className="mb-5">
                <Row>
                  <CategoryList
                    category={
                      categories[group.group] ||
                      Store.getCategoriesOfGroup(group.group)
                    }
                    group={group.group}
                    groupKey={group.group}
                  />
                </Row>
              </div>
            ))}
            
          {/* Add back the New Signs, Featured Videos, and Sign of the Day sections */}
          <div className="mb-5">
            <Row>
              <CategoryList
                category={
                  categories["New Signs"] ||
                  Store.getCategoriesOfGroup("New Signs")
                }
                group="New Signs"
                groupKey="New Signs"
              />
            </Row>
          </div>
          
          <div className="mb-5">
            <Row>
              <FeaturedVideoList videoItems={featuredVideos} />
            </Row>
          </div>
          
          {signOfDay?.word && (
            <div className="mb-5">
              <Row>
                <SignOfTheDay wordItem={signOfDay} />
              </Row>
            </div>
          )}
          
          {/* View all categories button */}
          <Row className="mb-5">
            <Col sm="12" className="text-center">
              {groups.length > 0 && (
                <Link
                  to="/groups"
                  className="btn btn-outline-primary"
                >
                  {t("view_all_category_btn")} &rarr;
                </Link>
              )}
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default Home;
