import React, { useState, useEffect } from "react";
import { Container, Row } from "shards-react";
import { useTranslation } from "react-i18next";

import CategoryList from "../components/category-vocabs/CategoryList";
import { Store } from "../flux";

const BrowseByCategory = () => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Log the initial state
    console.log("Initial groups from store:", Store.getGroups());
    
    // Get groups when component mounts
    const storeGroups = Store.getGroups();
    setGroups(storeGroups || []);
    setLoading(storeGroups.length === 0);
    
    // Add listener for store changes
    Store.addChangeListener(handleStoreChange);
    
    return () => {
      // Clean up listener when component unmounts
      Store.removeChangeListener(handleStoreChange);
    };
  }, []);
  
  const handleStoreChange = () => {
    // Update groups when store changes
    const updatedGroups = Store.getGroups();
    console.log("Updated groups from store:", updatedGroups);
    setGroups(updatedGroups || []);
    setLoading(false);
  };
  
  // Debug function to check categories for each group
  const debugCategories = (group) => {
    const categories = Store.getCategoriesOfGroup(group);
    console.log(`Categories for ${group}:`, categories);
    return categories;
  };
  
  return (
    <div className="category-list-wrapper">
      <Container fluid className="main-content-container">
        <Row className="p-4">
          <h1>{t("category")}</h1>
        </Row>
        <Row>
          {loading ? (
            <div className="col-12 text-center p-5">
              <p>Loading categories...</p>
            </div>
          ) : groups.length > 0 ? (
            groups.map((group, key) => {
              // Debug log for each group
              console.log(`Rendering group: ${group.group}`);
              const categories = debugCategories(group.group);
              
              return (
                <CategoryList 
                  category={categories} 
                  group={group.group} 
                  key={key} 
                />
              );
            })
          ) : (
            <div className="col-12 text-center p-5">
              <p>No categories found. Please check the API connection.</p>
            </div>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default BrowseByCategory;
