import { EventEmitter } from "events";

import Dispatcher from "./dispatcher";
import Constants from "./constants";
import getMainNavItems from "../data/main-nav-items";
import getAlphabets from "../data/alphabets/alphabets-arrays";
import getCurrentLocale from "../data/alphabets/currentLocale";
import cookies from "js-cookie";

let _store = {
  menuVisible: false,
  mainNavItems: getMainNavItems(),
  vocabsItems: [],        // to store all entries from BIM sheet
  groupCategoryItems: [], // to store all entries from Group sheet
  groupItems: [],         // to store groups (unique) only
  categoryItems: [],      // to store groups and categories pair (unique)
  signListVisible: false,
  openDropdown: false,
  alphabets: getAlphabets(),
  filePathBIMSheet: "/assets/BIM.xlsx",
  languages: ["en","ms"],
  countryCode: ["gb","my"],
  featuredVideosPlaylistId: "PLEztM-ga58Y4s6t5pac5uJKLeSSuspioQ",
  youtubeAPIKey: "AIzaSyBIk86nsIH0h4HSEgHPLI8bku6WKQlizDk",
  featuredVideos: [],
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

  // store all entries from BIM sheet
  storeExcel(value) {
    _store.vocabsItems = value;
    this.emit(Constants.CHANGE);
  }

  // store all entries from Group sheet
  storeExcelGroup(value) {
    _store.groupCategoryItems = value;              // get all entries from Group sheet
    this.emit(Constants.CHANGE);
    _store.groupItems = this.getGroupItems();       // get groups (unique)
    _store.categoryItems = this.getCategoryItems(); // get groups and categories pair (unique)
  }

  storeFeaturedVideos(value) {
    _store.featuredVideos = value;
    this.emit(Constants.CHANGE);
  }

  // get all entries from BIM sheet
  getVocabsItems() {
    return _store.vocabsItems;
  }

  getSortedVocabsItems(language) {
    return _store.vocabsItems.sort((a, b) => language === "en" ? (a.word).localeCompare(b.word) : (a.perkataan).localeCompare(b.perkataan));
  }

  // get all entries from Group sheet
  getGroupCategoryItems() {
    return _store.groupCategoryItems;
  }

  // get groups (unique)  
  getGroupItems() {
    const specialGroups = ["New Signs"]

    let lookup = new Set();
    const groups = this.getGroupCategoryItems()
      .map(
        (obj) => (
          {
            "group": obj.groupCategory.toString().split("/")[0],
            "kumpulan": obj.kumpulanKategori.toString().split("/")[0],
            "remark": obj.remark
          }
        )
      )
      .filter(
        (obj) => (!lookup.has(obj.group) && (this.isGroupInRelease(this.formatString(obj.group)) || specialGroups.includes(obj.group))) && lookup.add(obj.group)
      );
    return groups;
  }

  // get groups and categories pair (unique)  
  getCategoryItems() {
    let lookup = new Set();
    const categories = this.getGroupCategoryItems()
      .map(
        (obj) => (
          {
            "group": obj.groupCategory.toString().split("/")[0],
            "kumpulan": obj.kumpulanKategori.toString().split("/")[0],
            "category": obj.groupCategory.toString().split("/")[1],
            "kategori": obj.kumpulanKategori.toString().split("/")[1],
          }
        )
      )
      .filter((obj) => !lookup.has(obj.category) && lookup.add(obj.category));
    return categories;
  }

  getMenuState() {
    return _store.menuVisible;
  }

  getMainNavItems() {
    return _store.mainNavItems;
  }  

  getSidebarVocabItems() {
    return _store.vocabsItems;
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

  // get image for Category (fileName naming std: kategori.jpg)
  getCategoryImgSrc(kategori) {
    try {
      return require(`../images/bim/category/${kategori}.jpg`);
    } catch (err) {
      //default img (placeholder only)*
      return require(`../images/general/image-coming-soon.jpg`);
    }
  }

  // get image for Sign Word (fileName naming std: perkataan.jpg)
  getSignImgSrc(perkataan) {
    try {
      return require(`../images/bim/vocab/${perkataan}.jpg`);
    } catch (err) {
      //default img (placeholder only)*
      return require(`../images/general/image-coming-soon.jpg`);
    }
  }

  // get all the (unique) Groups
  getGroups() {
    return _store.groupItems;
  }

  // get all the (unique) Categories
  getCategories() {
    return _store.categoryItems;
  }

  getNewSigns() {
    const currentLanguageCode = cookies.get("i18next");
    const NewEnum = {
      YES: "Yes",
      NO: "No"
    }
    let vocabs = this.getVocabsItems();

    if (vocabs.length) {
      vocabs = vocabs.filter(vocab => vocab.new === NewEnum.YES)
        .map(obj => (
          {
            ...obj,
            "category": obj.groupCategory.toString().split("/")[1],
            "kategori": obj.kumpulanKategori.toString().split("/")[1]
          }))

      if (currentLanguageCode === "en") {
        vocabs.sort((a, b) => (a.word).localeCompare(b.word));
      }
      else {
        vocabs.sort((a, b) => (a.perkataan).localeCompare(b.perkataan));
      }

      return vocabs;
    }
    else {
      return []
    }
  }

  // get word of the day 'randomly' for each day based on date
  getSignOfTheDay() {
    var time = new Date().getTime();
    var days = Math.floor(time/ 86400000);
    const vocabsItems = this.getVocabsItems().sort((a, b) => (a.word).localeCompare(b.word))
    .sort(() => .5 - days);  
    var index = days % vocabsItems.length;
    return vocabsItems[index] !== undefined ? vocabsItems[index] : vocabsItems[80];
  }

  // get category list based on Group
  getCategoriesOfGroup(group) {

    if (this.formatString(group) === this.formatString("New Signs")) {
      return this.getNewSigns()
    }

    let lookup = new Set();
    const categories = this.getGroupCategoryItems()
      .filter(
        (obj) =>
          !this.formatString(obj.groupCategory.toString().split("/")[0]).localeCompare(
            this.formatString(group)
          )
      )
      .map(
        (obj) => (
          {
            "category": obj.groupCategory.toString().split("/")[1],
            "kategori": obj.kumpulanKategori.toString().split("/")[1]
          }
        )
      )
      .filter((obj) => (!lookup.has(obj.category) && this.isGroupCategoryInRelease(this.formatString(group), this.formatString(obj.category))) && lookup.add(obj.category));

    return categories;
  }

  // get vocabItem with splitted group&category pairs
  getVocabItem() {
    const splitGroupCategory = a => a !== undefined && a.toString().split(",");
    return this.getVocabsItems().map(o => ({ ...o, groupCategory: splitGroupCategory(o.groupCategory) }));
  }

  // get vocabs list based on Category and Group
  getVocabList(groupEng, categoryEng) {
    const groupCategoryPair = groupEng + "/" + categoryEng;

    // check if a vocab belongs to the group&category pair
    const isInGroupCategory = a => {
      var isGroup = false;
      for (let i = 0; i < a.length; i++) {
        if (!((this.formatGroupCategory(a[i].toString())).localeCompare(groupCategoryPair))) {
          isGroup = true;
        }
      }
      return isGroup
    };

    const vocabs = this.getVocabItem()                        // get vocabItem with splitted group&category pairs
      .filter(
        (obj) => obj.groupCategory !== undefined)               // filter out those of undefined
      .filter(
        (obj) => isInGroupCategory(obj.groupCategory))          // check if a vocab belongs to the desired group&category pair
      .sort((a, b) => b.order !== undefined ? (a.order)-(b.order) : (a.perkataan).localeCompare(b.perkataan)) // sort the list based on 'Order' column in ascending order, if applicable; if not, alphabetically based on perkataan

    return vocabs;
  }

  // check if a group is in release
  isGroupInRelease(groupEng) {
    const vocabs = this.getVocabsItems();
    for (let obj of vocabs) {
      if (obj.groupCategory !== undefined &&
        !this.formatString(obj.groupCategory.toString().split("/")[0]).localeCompare(
          (groupEng)
        )) {
        return true;
      }
    }
    return false;
  }

  // check if a group&category pair is in release
  isGroupCategoryInRelease(groupEng, categoryEng) {
    const vocabs = this.getVocabItem();
    for (let obj of vocabs) {
      for (let groupCat of obj.groupCategory) {
        if (groupCat !== undefined &&
          !this.formatString(groupCat.toString().split("/")[0]).localeCompare(
            (groupEng)) &&
          !this.formatString(groupCat.toString().split("/")[1]).localeCompare(
            (categoryEng))
        ) {
          return true;
        }
      }
    }
    return false;
  }

  // get vocabs detail (word, perkataan, image, video) based on Word
  getVocabDetail(signEng) {
    const vocabs = this.getVocabsItems().filter(
      (category) =>
        !this.formatString(category.word).localeCompare(
          this.formatString(signEng)
        )
    );
    return vocabs;
  }

  // get Top 3 Commonly Referred Groups to display in Home page
  // look for Remark with 'Home' in Group Excel
  getGroupsHome() {
    let groups = this.getGroups().filter(
      (group) => group.remark !== undefined && !group.remark.localeCompare("Home")
    )
    
    groups.push(groups.splice(groups.findIndex(item => item.group === "New Signs"), 1).pop()) // always making "new-signs" cat the last index of the list

    return groups
  }

  // format string to lower case and replace space with dash (for link path name)
  formatString(string) {
    try {
      return string.toLowerCase().replace(/\s+/g, "-");
    } catch (err) {
      return string;
    }
  }

  // format group&category pair (to follow link path name)
  formatGroupCategory(string) {
    try {
      // return string.toLowerCase().replace(/\s+/g, "-");
      const groupCat = string.toString().split("/");
      return this.formatString(groupCat[0]) + "/" + this.formatString(groupCat[1]);
    } catch (err) {
      return string;
    }
  }

  // get vocabs through matching first alphabet
  getVocabsAlphabet(alphabetFirst) {
    const vocabAlpha = this.getVocabsItems().filter((vocAl) =>
      getCurrentLocale() === "ms"
        ? this.formatString(vocAl.perkataan).startsWith(alphabetFirst)
        : this.formatString(vocAl.word).startsWith(alphabetFirst)
    )
    .sort((a, b) => cookies.get("i18next") === "ms" ? a.perkataan.localeCompare(b.perkataan) : a.word.localeCompare(b.word));
    return vocabAlpha;
  }

  getFilePathBIMSheet() {
    return _store.filePathBIMSheet;
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
