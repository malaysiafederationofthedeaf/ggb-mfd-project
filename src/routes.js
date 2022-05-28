import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, SideCategoryLayout, AdminBar, LoginBar } from "./layouts";

// Route Views
import ComingSoon from "./views/ComingSoon";
import UnderMaintenance from "./views/UnderMaintenance";
import AboutUs from "./views/AboutUs";
import Home from "./views/Home";
import BrowseByCategory from "./views/BrowseByCategory";
import SelectedGroup from "./views/SelectedGroup";
import SelectedCategory from "./views/SelectedCategory";
import SelectedVocab from "./views/SelectedVocab";
import SelectedAlphabets from "./views/SelectedAlphabet";
import FeaturedVideos from "./views/FeaturedVideos";
import Login from "./src-admin/views/Login";
import { ExcelUploader } from "./src-admin/views/ExcelUploader";
import { ImageUpload } from "./src-admin/views/ImageUpload";
import Dashboard from "./src-admin/Dashboard";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/home" />,
  },
  {
    path: "/home",
    exact: true,
    layout: DefaultLayout,
    component: Home,
  },
  {
    path: "/comingsoon",
    exact: true,
    layout: DefaultLayout,
    component: ComingSoon,
  },
  {
    path: "/maintenance",
    exact: true,
    layout: DefaultLayout,
    component: UnderMaintenance,
  },
  {
    path: "/about-us",
    exact: true,
    layout: DefaultLayout,
    component: AboutUs,
  },
  {
    path: "/groups",
    exact: true,
    layout: DefaultLayout,
    component: BrowseByCategory,
  },
  {
    path: "/groups/new-signs",
    exact: true,
    layout: SideCategoryLayout,
    component: SelectedCategory
  },
  {
    path: "/groups/new-signs/:vocab",
    exact: true,
    layout: SideCategoryLayout,
    component: SelectedVocab
  },
  {
    path: "/groups/:group",
    exact: true,
    layout: SideCategoryLayout,
    component: SelectedGroup,
  },
  {
    path: "/groups/:group/:category",
    exact: true,
    layout: SideCategoryLayout,
    component: SelectedCategory,
  },
  {
    path: "/groups/:group/:category/:vocab",
    exact: true,
    layout: SideCategoryLayout,
    component: SelectedVocab,
  },
  {
    path: "/alphabets",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="alphabets/a" />,
  },
  {
    path: "/alphabets/:alphabet",
    exact: true,
    layout: SideCategoryLayout,
    component: SelectedAlphabets,
  },
  {
    path: "/alphabets/:alphabet/:vocab",
    exact: true,
    layout: SideCategoryLayout,
    component: SelectedVocab,
  },
  {
    path: "/featured-videos",
    exact: true,
    layout: DefaultLayout,
    component: FeaturedVideos,
  },   
  {
    path: "/admin/excelupload",
    exact: true,
    layout: AdminBar,
    component: sessionStorage.getItem("email")==='null' || sessionStorage.getItem("email")===null 
    ? () => <Redirect to= "/admin"/> : ExcelUploader,
  },
  {
    path: "/admin/imageupload",
    exact: true,
    layout: AdminBar,
    component: sessionStorage.getItem("email")==='null' || sessionStorage.getItem("email")===null 
    ? () => <Redirect to= "/admin"/> : ImageUpload,
  },
  {
    path: "/admin/home",
    exact: true,
    layout: AdminBar,
    component: sessionStorage.getItem("email")==='null' || sessionStorage.getItem("email")===null 
    ?  () => <Redirect to= "/admin"/>: Dashboard,
  },
  {
    path: "/admin",
    exact: true,
    layout: LoginBar,
    component: sessionStorage.getItem("email")==='null' || sessionStorage.getItem("email")===null 
    ? Login : () => <Redirect to= "/admin/home"/>,
  },
];
