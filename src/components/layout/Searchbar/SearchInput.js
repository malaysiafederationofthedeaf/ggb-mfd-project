import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Select, { components } from "react-select";
import { useNavigate } from "react-router-dom";
import i18next from "i18next";
import { Store } from "../../../flux";
import apiClient from "../../../services/api/client";

const SearchInput = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [searchInput, setSearchInput] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const currentLanguage = i18next.language;
  const debounceRef = useRef(null);
  const isMounted = useRef(true);

  const transformData = (data) => (
    data.map(item => ({
      groupCategory: item.category_group?.GroupCategory || `${item.Group}/${item.Category}`,
      word: item.Word || '',
      perkataan: item.Perkataan || ''
    }))
    // Removed filter for VALID_RELEASES
  );

  const searchSpecificTerm = async (query) => {
    if (!query || query.length < 2) {
      if (isMounted.current) setOptions([]);
      return;
    }

    try {
      if (isMounted.current) setLoading(true);
      const field = currentLanguage === "en" ? "Word" : "Perkataan";
      const res = await apiClient.get(`/api/bims?populate=category_group&filters[${field}][$containsi]=${encodeURIComponent(query)}`);
      const results = transformData(res.data?.data || []);

      const sortedResults = results.sort((a, b) =>
        currentLanguage === "en" ? a.word.localeCompare(b.word) : a.perkataan.localeCompare(b.perkataan)
      );

      if (isMounted.current) {
        setOptions(sortedResults);
      }
    } catch (err) {
      console.error("Search fetch error:", err);
      if (isMounted.current) setOptions([]);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const handleInputChange = (input, { action }) => {
    if (action !== "input-change") return;
    setSearchInput(input);
    setOpenMenu(true);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchSpecificTerm(input), 300);
  };

  const handleSelectChange = (selected) => {
    if (!selected) return;

    const groupCategory = selected.groupCategory.split(",")[0];
    const [groupRaw, categoryRaw] = groupCategory.split("/");
    const group = Store.formatString(groupRaw);
    const category = Store.formatString(categoryRaw);

    // Use full word in :vocab, encoded
    const vocabParam = encodeURIComponent(selected.word);
    navigate(`/groups/${group}/${category}/${vocabParam}`);
    setOpenMenu(false);
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      clearTimeout(debounceRef.current);
    };
  }, [currentLanguage]);

  const Menu = (props) => <components.Menu {...props}>{props.children}</components.Menu>;

  return (
    <div className="search-bar">
      <form>
        <Select
          options={options}
          onChange={handleSelectChange}
          isLoading={loading}
          getOptionLabel={(option) => (
            <strong className="text-m-2">
              {currentLanguage === "en" ? option.word : option.perkataan}
            </strong>
          )}
          getOptionValue={(option) => currentLanguage === "en" ? option.word : option.perkataan}
          onInputChange={handleInputChange}
          onBlur={() => setOpenMenu(false)}
          menuIsOpen={openMenu}
          value={null}
          placeholder={loading ? t("loading") : t("search_placeholder")}
          noOptionsMessage={() => loading ? t("loading") : t("no_results")}
          filterOption={(option, input) => {
            const label = currentLanguage === "en" ? option.data.word : option.data.perkataan;
            return label.toLowerCase().includes(input.toLowerCase());
          }}
          components={{ Menu }}
        />
      </form>
    </div>
  );
};

export default SearchInput;
