import React, { useState } from "react";
import i18next from "i18next";
import {
  Button,
} from "shards-react";
import "flag-icon-css/css/flag-icon.min.css";
import { Store } from "../../../flux";

const languages = Store.getLanguages();
const countryCode = Store.getCountryCode();

const NavbarTranslate = () => {
  const [flag, setFlag] = useState(false)

  const toggleLocale = () => {
    setFlag(!flag)
    if(flag)
    // English
      i18next.changeLanguage(languages[0])
    else
    // Malay
      i18next.changeLanguage(languages[1])
  }
  

  return (
    <div className="navbar-translate-btn">
      <Button onClick={toggleLocale}>
        <span
          className={`flag-icon flag-icon-${!flag ? countryCode[0] : countryCode[1]} p-1`}
        ></span></Button>
      </div>
  );
};

export default NavbarTranslate;
