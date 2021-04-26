import React from "react";
import {
  FormInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "shards-react";
import { useTranslation } from "react-i18next";
const SearchInput = ({ onChange, onFocus }) => {
  const { t } = useTranslation();
  return (
    <div className="search-bar">
      <InputGroup>
        <FormInput
          placeholder={t("search_placeholder")}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onFocus}
        />
        <InputGroupAddon type="append">
          <InputGroupText>
            <i className="material-icons">search</i>
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

export default SearchInput;
