import React from "react";
import { useState, useEffect } from "react";
import { Container } from "shards-react";

import AboutUsPreview from "../components/about-us/AboutUsPreview";
import categoriesItems from "../data/categories/categories-items";
import CategoryList from "../components/category-vocabs/CategoryList";
import SignList from "../components/SignList";
import { Store } from "../flux";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState(Store.getSearchTerm());
  const [searchState, setSearchState] = useState(Store.getSearchState());
  useEffect(() => {
    Store.addChangeListener(() => {
      setSearchTerm(Store.getSearchTerm());
      setSearchState(Store.getSearchState());
    });
  }, []);
  return (
    <>
      <AboutUsPreview />

      {/* Search Lists */}
      {searchState ? (
        <SignList filter={searchTerm} />
      ) : (
        <Container fluid className="main-content-container">
          <div className="category-list-wrapper">
            {/* Signs Blocks */}
            {categoriesItems.slice(0, 2).map((category) => (
                <CategoryList category={category} />
            ))}
          </div>
        </Container>
      )}
    </>
  );
};

export default Home;
