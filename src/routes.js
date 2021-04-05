import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import Errors from "./views/Errors";
import AboutUs from "./views/AboutUs";
import BrowseByCategory from "./views/BrowseByCategory";
import SelectedCategory from "./views/SelectedCategory";
import SelectedVocab from "./views/SelectedVocab";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/about-us" />,
  },
  {
    path: "/errors",
    layout: DefaultLayout,
    component: Errors,
  },
  {
    path: "/about-us",
    layout: DefaultLayout,
    component: AboutUs,
  },
  {
    path: "/browse-by-category",
    layout: DefaultLayout,
    component: BrowseByCategory,
  },
  {
    path: "/category/:category",
    layout: DefaultLayout,
    component: SelectedCategory,
  },
  {
    path: "/vocab/:category/:vocab",
    layout: DefaultLayout,
    component: SelectedVocab,
  },
];
