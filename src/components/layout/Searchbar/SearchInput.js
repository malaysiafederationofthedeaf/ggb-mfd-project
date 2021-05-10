import React from "react";
import {
  FormInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "shards-react";
import { useTranslation } from "react-i18next";

import { Store } from "../../../flux";
import SearchResults from "./SearchResults";

const SearchInput = ({ onChange, onFocus }) => {  
    const { t } = useTranslation();
    
    return (
      <>
        <div className="search-bar">
          <InputGroup>
            <FormInput
              placeholder={t("search_placeholder")}
              onChange={onChange}
              onFocus={onFocus}      
              onBlur={Store.closeSearch()} 
            />
            <InputGroupAddon type="append">
              <InputGroupText>
                <i className="material-icons">search</i>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
        {Store.getSearchState() &&
          <SearchResults filter={Store.getSearchTerm()} />}      
      </>
    );
}

export default SearchInput;
