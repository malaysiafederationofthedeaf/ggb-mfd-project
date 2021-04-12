import React, { useState, useEffect } from "react";
import i18next from "i18next";
import cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "shards-react";
import "flag-icon-css/css/flag-icon.min.css";
import GlobeIcon from "../../../images/mfd/globe-translate-icon.js";
import { Store } from "../../../flux";

const languages = Store.getLanguages();

const NavbarTranslate = ({ toggle }) => {
  const currentLanguageCode = cookies.get("i18next") || "en";
  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState(false);
  useEffect(() => {
    Store.addChangeListener(() => {
      setOpenDropdown(Store.getOpenDropdown());
    });
  }, []);

  return (
    <div className="d-flex my-2">
      <Dropdown open={openDropdown} toggle={toggle}>
        <DropdownToggle>
          <GlobeIcon />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem disabled>
            <span className="dropdown-item-text font-weight-bold">
              {t("languages")}
            </span>
          </DropdownItem>
          {languages.map(({ code, name, country_code }) => (
            <DropdownItem
              className="dropdown-item"
              onClick={() => i18next.changeLanguage(code)}
              disabled={code === currentLanguageCode}
              key={country_code}
            >
              <span
                className={`flag-icon flag-icon-${country_code} mx-2`}
                style={{ opacity: code === currentLanguageCode ? 0.5 : 1 }}
              ></span>
              {name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default NavbarTranslate;
