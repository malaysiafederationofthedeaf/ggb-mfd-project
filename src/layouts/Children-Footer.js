import React from "react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import MainFooter from "../components/layout/MainFooter";
import SearchResults from "../components/layout/Searchbar/SearchResults";
import { Store } from "../flux";

const ChildrenFooter = ({ children, noFooter }) => {
  const [searchTerm, setSearchTerm] = useState(Store.getSearchTerm());
  const [searchState, setSearchState] = useState(Store.getSearchState());
  useEffect(() => {
    Store.addChangeListener(onChange);
    return () => Store.removeChangeListener(onChange);
  }, []);

  const onChange = () => {
    setSearchTerm(Store.getSearchTerm());
    setSearchState(Store.getSearchState());
  };
  
  return (
    <>
        {searchState &&
        <SearchResults filter={searchTerm} />}
        <div onClick={() => Store.closeSearch()}>
          <div>
              {children}
              {!noFooter && <MainFooter />}
          </div>    
        </div>
    </>
  );
};

ChildrenFooter.propTypes = {
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool,
};

ChildrenFooter.defaultProps = {
  noFooter: false,
};

export default ChildrenFooter;
