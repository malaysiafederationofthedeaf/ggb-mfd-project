import React from "react";
import { Navigate } from "react-router-dom";

// Layout Types
import { DefaultLayout, SideCategoryLayout } from "./layouts";

import { lazy } from "react";

// Route Views
const ComingSoon = lazy(() => import("./views/ComingSoon"));
const UnderMaintenance = lazy(() => import("./views/UnderMaintenance"));
const AboutUs = lazy(() => import("./views/AboutUs"));
const Home = lazy(() => import("./views/Home"));
const BrowseByCategory = lazy(() => import("./views/BrowseByCategory"));
const SelectedGroup = lazy(() => import("./views/SelectedGroup"));
const SelectedCategory = lazy(() => import("./views/SelectedCategory"));
const SelectedVocab = lazy(() => import("./views/SelectedVocab"));
const SelectedAlphabets = lazy(() => import("./views/SelectedAlphabet"));
const FeaturedVideos = lazy(() => import("./views/FeaturedVideos"));
const NotFound = lazy(() => import("./views/NotFound"));


const routes = [
  {
    path: "/",
    layout: DefaultLayout,
    component: () => <Navigate to="/home" />,
  },
  {
    path: "/home",
    layout: DefaultLayout,
    component: Home,
  },
  {
    path: "/comingsoon",
    layout: DefaultLayout,
    component: ComingSoon,
  },
  {
    path: "/maintenance",
    layout: DefaultLayout,
    component: UnderMaintenance,
  },
  {
    path: "/about-us",
    layout: DefaultLayout,
    component: AboutUs,
  },
  {
    path: "/groups",
    layout: DefaultLayout,
    component: BrowseByCategory,
  },
  {
    path: "/groups/new-signs",
    layout: SideCategoryLayout,
    component: SelectedCategory
  },
  {
    path: "/groups/new-signs/:vocab",
    layout: SideCategoryLayout,
    component: SelectedVocab
  },
  {
    path: "/groups/:group",
    layout: SideCategoryLayout,
    component: SelectedGroup,
  },
  {
    path: "/groups/:group/:category",
    layout: SideCategoryLayout,
    component: SelectedCategory,
  },
  {
    path: "/groups/:group/:category/:vocab",
    layout: SideCategoryLayout,
    component: SelectedVocab,
  },
  {
    path: "/alphabets",
    layout: DefaultLayout,
    component: () => <Navigate to="/alphabets/a" />,
  },
  {
    path: "/alphabets/:alphabet",
    layout: SideCategoryLayout,
    component: SelectedAlphabets,
  },
  {
    path: "/alphabets/:alphabet/:vocab",
    layout: SideCategoryLayout,
    component: SelectedVocab,
  },
  {
    path: "/featured-videos",
    layout: DefaultLayout,
    component: FeaturedVideos,
  },
  {
    path: "*",
    layout: DefaultLayout,
    component: NotFound,
  },
];

export default routes;