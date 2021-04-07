import React from "react";
import {
  FormInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "shards-react";

const SearchInput = ({ onChange, onFocus }) => {
  return (
    <div>
      <InputGroup>
        <FormInput
          placeholder="Cari MyBIM di sini / Search MyBIM here"
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
