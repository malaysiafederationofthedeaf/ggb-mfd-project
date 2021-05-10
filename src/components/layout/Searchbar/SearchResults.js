import React from "react";
import { Button, Row } from "shards-react";

import Store from "../../../flux/store";
import SearchVocabList from '../../category-vocabs/SearchVocabList';

const SearchResults = ({ filter }) => {
  const vocabsOnly = Store.getVocabsOnly()
    // eslint-disable-next-line array-callback-return
    .filter((val) => {
      if (filter === "") {
        return val;
      } else if (
        val.wordMalay.toLowerCase().includes(filter.toLowerCase()) ||
        val.word.toLowerCase().includes(filter.toLowerCase())
      ) {
        return val;
      }
    })

  return (
    <div className="search-sign-list">
    <Row className="sign-list-close-row">
      <Button className="sign-list-close-btn" onClick={() => Store.closeSearch()}>
        <i className="material-icons">close</i>
      </Button>  
    </Row>   
    <SearchVocabList vocabs={vocabsOnly} group={vocabsOnly.group} category={vocabsOnly.category} /> 
    </div>
  );
};

export default SearchResults;
