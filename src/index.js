import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { Store } from "./flux";

import Dispatcher from "../src/flux/dispatcher";
import readExcel from "../src/data/categories/readExcel";
import UnderMaintenance from "./views/UnderMaintenance";

readExcel.then(
  // Promise status 200
  (value) => {
    Dispatcher.dispatch({
      actionType: "STORE_EXCEL",
      payload: value,
    });

    i18n
      .use(initReactI18next) // passes i18n down to react-i18next
      .use(LanguageDetector)
      .use(HttpApi)
      .init({
        supportedLngs: ["en", "ms"],
        fallbackLng: "en",
        detection: {
          order: ["path", "cookie", "htmlTag", "localStorage", "subdomain"],
          caches: ["cookie"],
        },
        backend: { loadPath: "/assets/locales/{{lng}}/translation.json" },
        interpolation: {
          escapeValue: false,
        },
      });

    //Add Sign Groups & Categories Translations to namespace: 'group-category'
    Store.getCategories().map((group) => {
      i18n.addResourceBundle("en", "group-category", {
        [Store.formatString(group.category)]: group.category,
        [Store.formatString(group.group)]: group.group,
      });
      i18n.addResourceBundle("ms", "group-category", {
        [Store.formatString(group.category)]: group.kategori,
        [Store.formatString(group.group)]: group.kumpulan,
      });
      return i18n;
    });

    //Add Sign Words Translation to namespace: 'word'
    Store.getVocabsItems().map((group) => {
      i18n.addResourceBundle("en", "word", {
        [Store.formatString(group.word)]: group.perkataan,
      });
      i18n.addResourceBundle("ms", "word", {
        [Store.formatString(group.word)]: group.perkataan,
      });
      return i18n;
    });

    ReactDOM.render(
      <Suspense fallback="Loading">
        <App />
      </Suspense>,
      document.getElementById("root")
    );
  },
  // Promise status 400
  (error) =>
    ReactDOM.render(
      <Suspense fallback="Loading">
        <UnderMaintenance />
      </Suspense>,
      document.getElementById("root")
    )
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
