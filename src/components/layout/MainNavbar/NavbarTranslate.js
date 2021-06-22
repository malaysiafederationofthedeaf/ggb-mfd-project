import React, { useState } from "react";
import i18next from "i18next";
import cookies from "js-cookie";
import { Button } from "shards-react";
import "flag-icon-css/css/flag-icon.min.css";
import { Store } from "../../../flux";

const languages = Store.getLanguages();
const countryCode = Store.getCountryCode();

const NavbarTranslate = () => {
  const currentLanguageCode = cookies.get("i18next") || "ms";
  const myFlag = currentLanguageCode === languages[1];
  const [flag, setFlag] = useState(myFlag ? countryCode[1] : countryCode[0]);

  const toggleLocale = () => {
    if (myFlag) {
      // English
      i18next.changeLanguage(languages[0]);
      setFlag(countryCode[0]);
    }
    // Malay
    else {
      i18next.changeLanguage(languages[1]);
      setFlag(countryCode[1]);
    }
  };
  console.log(flag);
  console.log(currentLanguageCode);
  return (
    <div className="navbar-translate-btn">
      <Button onClick={toggleLocale}>
        <span className={`flag-icon flag-icon-${flag} p-1`}></span>
      </Button>
    </div>
  );
};

export default NavbarTranslate;
