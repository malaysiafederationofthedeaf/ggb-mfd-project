import React, { Fragment } from "react";
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
  };

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
          getOptionValue={(option) => [option.word, option.perkataan]}
          getOptionLabel={(option) => (
            <>
              <strong className="text-muted">
                {i18next.language === "en" ? option.word : option.perkataan}
              </strong>
              :
              <strong className="text m-2">
                {i18next.language === "en" ? option.perkataan : option.word}
              </strong>
            </>
          )}
          components={{ Menu }}
          placeholder={t("search_placeholder")}
        />
      </form>
    </div>
  );
};

export default SearchInput;
