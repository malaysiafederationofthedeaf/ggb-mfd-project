import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Select, { components } from "react-select";
import { useNavigate } from "react-router-dom";
import i18next from "i18next";

import { Store } from "../../../flux";

const SearchInput = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onSelectChange = (value) => {
    const groupCat = value.groupCategory.toString().includes(",") ? 
      value.groupCategory.toString().substring(0, value.groupCategory.indexOf(",")) : // get the first group&category pair if there are multiple group&category pairs
      value.groupCategory.toString(); 
    const group = Store.formatString(groupCat.split("/")[0]);
    const category = Store.formatString(groupCat.split("/")[1]);

    const path = `/groups/${group}/${category}/${Store.formatString(value.word)}`;
    navigate(path);
    setOpenMenu(false);
  };

  const [openMenu, setOpenMenu] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  const handleInputChange = (query, {action}) => {
    if(action === "input-change") {
      setOpenMenu(true);
      setSearchInput(query === null ? '' : query); 
    }
  }

  const hideMenu = () => {
    setOpenMenu(false);
  }

  const Menu = (props) => {
    return (
      <div>
        <components.Menu {...props}>{props.children}</components.Menu>
      </div>
    );
  };

  const currentLanguage = i18next.language;

  return (
    <div className="search-bar">
      <form>
        <Select
          onChange={(value) => onSelectChange(value)}
          options={Store.getSortedVocabsItems(currentLanguage)}
          getOptionValue={(option) => currentLanguage === "en" ? option.word : option.perkataan}
          getOptionLabel={(option) => (
            <>
              <strong className="text-m-2">
                {currentLanguage === "en" ? option.word : option.perkataan}
              </strong>
            </>
          )}
          components={{ Menu }}
          placeholder={t("search_placeholder")}
          onInputChange={handleInputChange}
          onBlur={hideMenu}
          menuIsOpen={openMenu}
          value={searchInput}
        />
      </form>
    </div>
  );
};

export default SearchInput;
