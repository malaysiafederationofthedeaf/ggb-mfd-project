import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import Select, { components } from "react-select";
import { useHistory } from "react-router-dom";
import i18next from "i18next";

import { Store } from "../../../flux";

const SearchInput = () => {
  const { t } = useTranslation();

  const history = useHistory();
  const onSelectChange = (value) => {
    const groupCat = value.groupCategory.toString().includes(",") ? 
      value.groupCategory.toString().substring(0, value.groupCategory.indexOf(",")) : // get the first group&category pair if there are multiple group&category pairs
      value.groupCategory.toString(); 
    const group = Store.formatString(groupCat.split("/")[0]);
    const category = Store.formatString(groupCat.split("/")[1]);

    let path = `/groups/${group}/${category}/${Store.formatString(value.word)}`;
    history.push(path);
    setOpenMenu(false);
  };

  const [openMenu, setOpenMenu] = useState(false);
  
  const handleInputChange = (query, {action}) => {
    if(action === "input-change") {
      setOpenMenu(true);
    }
  }

  const hideMenu = () => {
    setOpenMenu(false);
  }

  const Menu = (props) => {
    return (
      <Fragment>
        <components.Menu {...props}>{props.children}</components.Menu>
      </Fragment>
    );
  };

  return (
    <div className="search-bar">
      <form>
        <Select
          onChange={(value) => onSelectChange(value)}
          options={Store.getVocabsItems()}
          getOptionValue={(option) => i18next.language === "en" ? option.word : option.perkataan}
          getOptionLabel={(option) => (
            <>
              <strong className="text-m-2">
                {i18next.language === "en" ? option.word : option.perkataan}
              </strong>
            </>
          )}
          components={{ Menu }}
          placeholder={t("search_placeholder")}
          onInputChange={handleInputChange}
          onBlur={hideMenu}
          menuIsOpen={openMenu}
        />
      </form>
    </div>
  );
};

export default SearchInput;
