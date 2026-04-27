import { EventEmitter } from "events";

import Dispatcher from "./dispatcher";
import Constants from "./constants";
import getMainNavItems from "../data/main-nav-items";
import getAlphabets from "../data/alphabets/alphabets-arrays";

let _store = {
  menuVisible: false,
  mainNavItems: getMainNavItems(),
  signListVisible: false,
  openDropdown: false,
  alphabets: getAlphabets(),
  languages: ["en","ms"],
  countryCode: ["gb","my"],
  featuredVideosPlaylistId: "PLEztM-ga58Y4s6t5pac5uJKLeSSuspioQ",
  youtubeAPIKey: "AIzaSyBIk86nsIH0h4HSEgHPLI8bku6WKQlizDk",
  featuredVideos: [],
  imageURL: "https://pub-484eefc799ec44daac47eef319579772.r2.dev/",
};

// Shared slug for vocab images (must match Strapi lifecycles)
const slugPerkataan = (perkataan) => {
  if (!perkataan) return "";
  return perkataan
    .trim()
    .replace(/[!/]/g, "-")        // legacy: '!' and '/' -> '-'
    .replace(/\?/g, "")           // legacy: remove '?'
    .replace(/[<>:"\\|*]/g, "")   // new: strip Windows-illegal chars
    .replace(/[. ]+$/g, "");      // new: strip trailing '.' / spaces
};

class Store extends EventEmitter {
  constructor() {
    super();

    this.registerToActions = this.registerToActions.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.storeExcel = this.storeExcel.bind(this);
    this.storeExcelGroup = this.storeExcelGroup.bind(this);
    this.storeFeaturedVideos = this.storeFeaturedVideos.bind(this);

    Dispatcher.register(this.registerToActions.bind(this));
  }

  registerToActions({ actionType, payload }) {
    switch (actionType) {
      case Constants.TOGGLE_SIDEBAR:
        this.toggleSidebar();
        break;

      case Constants.TOGGLE_DROPDOWN:
        this.toggleDropdown();
        break;

      case Constants.STORE_EXCEL:     // store all the entries from BIM sheet
        this.storeExcel(payload);
        break;

      case Constants.STORE_EXCEL_GROUP: // store all the entries from Group sheet
        this.storeExcelGroup(payload);
        break;

      case Constants.STORE_FEATURED_VIDEOS: // store all the entries from Group sheet
        this.storeFeaturedVideos(payload);
        break;        

      default:
    }
  }

  toggleSidebar() {
    _store.menuVisible = !_store.menuVisible;
    this.emit(Constants.CHANGE);
  }

  toggleDropdown() {
    _store.openDropdown = !_store.openDropdown;
    this.emit(Constants.CHANGE);
  }

  // Add this method to debug the store state
  logStoreState() {
    console.log("Store state:", {
      vocabsItems: _store.vocabsItems.length,
      groupCategoryItems: _store.groupCategoryItems.length,
      groupItems: _store.groupItems.length,
      categoryItems: _store.categoryItems.length
    });
  }

  // store all entries from BIM sheet
  storeExcel(value) {
    console.log("Storing vocab items:", value.length);
    _store.vocabsItems = value;
    this.emit(Constants.CHANGE);
  }

  // store all entries from Group sheet
  storeExcelGroup(value) {
    console.log("Storing group category items:", value.length);
    _store.groupCategoryItems = value;              // get all entries from Group sheet
    this.emit(Constants.CHANGE);
    _store.groupItems = this.getGroupItems();       // get groups (unique)
    _store.categoryItems = this.getCategoryItems(); // get groups and categories pair (unique)
    
    // Log the processed data for debugging
    console.log("Processed group items:", _store.groupItems.length);
    console.log("Processed category items:", _store.categoryItems.length);
  }

  storeFeaturedVideos(value) {
    _store.featuredVideos = value;
    this.emit(Constants.CHANGE);
  }

  getMenuState() {
    return _store.menuVisible;
  }

  getMainNavItems() {
    return _store.mainNavItems;
  }  

  getOpenDropdown() {
    return _store.openDropdown;
  }

  getAlphabetsList() {
    return _store.alphabets;
  }

  getLanguages() {
    return _store.languages;
  }

  getCountryCode() {
    return _store.countryCode;
  }

  getFeaturedVideosList() {
    return _store.featuredVideos;
  }

  getFeaturedVideosPlaylistUrl() {
    return "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId="
    + _store.featuredVideosPlaylistId
    + "&key="
    + _store.youtubeAPIKey;
  }

  getFeaturedVideoUrl(videoId) {
    return "https://youtu.be/" + videoId;
  }

  // get image for Category (from Cloudflare R2)
  getCategoryImgSrc(kumpulanKategori) {
    if (!kumpulanKategori) return "";
    const fileName = encodeURIComponent(kumpulanKategori);
    return `${_store.imageURL}category/${fileName}.webp`;
  }

  // get image for vocab (from Cloudflare R2)
  getSignImgSrc(perkataan) {
    if (!perkataan) return "";
    const baseName = slugPerkataan(perkataan);           // shared slug
    const fileName = encodeURIComponent(baseName);       // single encode for URL
    return `${_store.imageURL}vocab/${fileName}.webp`;
  }

  // format string to lower case, replace space with dash, and remove '?' and '/' (for link path name)
  formatString(string) {
    if (!string) return '';
    try {
      let stringFormatted = string.toLowerCase().replace(/\s+/g, "-");
      // Strip characters that can confuse routing or matching
      stringFormatted = stringFormatted.replace(/[?\/<>.]/g, "");
      return stringFormatted;
    } catch (err) {
      return string;
    }
}

  // format group&category pair (to follow link path name)
  formatGroupCategory(string) {
    if (!string) return '';
    
    try {
      // return string.toLowerCase().replace(/\s+/g, "-");
      const groupCat = string.toString().split("/");
      return this.formatString(groupCat[0]) + "/" + this.formatString(groupCat[1]);
    } catch (err) {
      return string;
    }
  }

  getBaseURLBIMSheet() {
    const baseURL = window.location.origin;
    const filePathname = _store.filePathBIMSheet;
    return baseURL + filePathname;
  }

  addChangeListener(callback) {
    this.on(Constants.CHANGE, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(Constants.CHANGE, callback);
  }
}
export default new Store();
