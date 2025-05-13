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
  imageURL: "https://res.cloudinary.com/dp3vzcgzq/image/upload/",
  signOfTheDay: null,
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

  storeSignOfTheDay(value) {
    _store.signOfTheDay = value;
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
    const specialGroups = ["New Signs"];
    
    if (!this.getGroupCategoryItems() || this.getGroupCategoryItems().length === 0) {
      console.warn("No group category items available");
      return [];
    }

    let lookup = new Set();
    const groups = this.getGroupCategoryItems()
      .filter(obj => obj !== null && obj !== undefined)
      .map(obj => {
        // Handle the new data structure
        const group = obj.groupCategory?.toString().split("/")[0] || 
                     obj.GroupCategory?.toString().split("/")[0] || '';
        const kumpulan = obj.kumpulanKategori?.toString().split("/")[0] || 
                        obj.KumpulanKategori?.toString().split("/")[0] || '';
        const remark = obj.remark || obj.Remark || '';
        
        return { group, kumpulan, remark };
      })
      .filter(obj => obj.group && obj.kumpulan) // Filter out items with empty group or kumpulan
      .filter(obj => 
        (!lookup.has(obj.group) && 
        (this.isGroupInRelease(this.formatString(obj.group)) || 
         specialGroups.includes(obj.group))) && 
        lookup.add(obj.group)
      );
    
    return groups;
  }

  // get groups and categories pair (unique)  
  getCategoryItems() {
    let lookup = new Set();
    const categories = this.getGroupCategoryItems()
      .map(
        (obj) => {
          // Handle the new data structure
          return {
            "group": obj.groupCategory?.toString().split("/")[0] || obj.GroupCategory?.toString().split("/")[0] || '',
            "kumpulan": obj.kumpulanKategori?.toString().split("/")[0] || obj.KumpulanKategori?.toString().split("/")[0] || '',
            "category": obj.groupCategory?.toString().split("/")[1] || obj.GroupCategory?.toString().split("/")[1] || '',
            "kategori": obj.kumpulanKategori?.toString().split("/")[1] || obj.KumpulanKategori?.toString().split("/")[1] || '',
          }
        }
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

  // get image for Category (from cloudinary)
  getCategoryImgSrc(kumpulanKategori) {
    const kategoriPublicId = "Category_" + kumpulanKategori
      .replace(/&/g, "_")
      .replace(/[()]/g, "")
      .replace(/\s+/g, "_") // Remove other special characters if needed
      .replace(/_+/g, "_"); // Collapse multiple underscores into one
      return `${_store.imageURL}${kategoriPublicId}.jpg`;
  }

  // get image for vocab (from cloudinary)
  getSignImgSrc(perkataan) {
    const perkataanPublicId = perkataan
      .trim()
      .replace(/&/g, "_")           // Replace '&' with '_'
      .replace(/[()'']/g, "")        // Remove '(', ')', and single quote (')
      .replace(/,/g, "")            // Remove commas
      .replace(/!/g, "%21")         // Replace '!' with '%21'
      .replace(/\//g, "-")          // Replace '/' with '-'
      .replace(/\s+/g, "_");        // Replace spaces with '_'
      return `${_store.imageURL}${perkataanPublicId}.jpg`;
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
            "category": obj.groupCategory?.toString().split("/")[1] || '',
            "kategori": obj.kumpulanKategori?.toString().split("/")[1] || ''
          }));

      // Remove duplicates
      let lookup = new Set();
      vocabs = vocabs.filter(obj => !lookup.has(obj.category) && lookup.add(obj.category));

      return vocabs;
    }
    else {
      return []
    }
  }

  // get word of the day 'randomly' for each day based on date
  getSignOfTheDay() {
    // If we have a stored sign of the day, return it
    if (_store.signOfTheDay) {
      return _store.signOfTheDay;
    }
    
    // Otherwise check if there's one for today's date
    const sotd = this.checkSignOfTheDay();
    if(sotd !== undefined) {
      return sotd;
    }
    else {
      // If no sign of the day is set, generate one based on the date
      var time = new Date().getTime();
      var days = Math.floor(time/ 86400000);
      const vocabsItems = this.getVocabsItems().sort((a, b) => (a.word).localeCompare(b.word))
      .sort(() => .5 - days);  
      var index = days % vocabsItems.length;
      return vocabsItems[index] !== undefined ? vocabsItems[index] : vocabsItems[0];
    }
  }

  // check if sign of the day exists in SOTD column (check for today's date)
  checkSignOfTheDay() {
    const signsOfTheDay = this.getVocabsItems()
      .filter((obj) => obj.sotd != null) // Check for both null and undefined
      .filter((obj) => obj.sotd?.toString() === this.formatDate()) // Safe conversion
      .sort((a, b) => (a.word).localeCompare(b.word));
    return signsOfTheDay[0];
  }

  // get date in yyyy-mm-dd format 
  formatDate(date) {
    var d = date !== undefined ? new Date(date) : new Date(); // if no date is passed, get current date
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  // get category list based on Group
  getCategoriesOfGroup(group) {
    if (!group) {
      console.warn("No group provided to getCategoriesOfGroup");
      return [];
    }

    if (this.formatString(group) === this.formatString("New Signs")) {
      return this.getNewSigns();
    }

    let lookup = new Set();
    const categories = this.getGroupCategoryItems()
      .filter(obj => obj !== null && obj !== undefined)
      .filter(obj => {
        const groupCat = obj.groupCategory || obj.GroupCategory;
        if (!groupCat) return false;
        
        const groupPart = groupCat.toString().split("/")[0] || '';
        return this.formatString(groupPart) === this.formatString(group);
      })
      .map(obj => {
        const groupCat = obj.groupCategory || obj.GroupCategory;
        const kumpulanKat = obj.kumpulanKategori || obj.KumpulanKategori;
        
        return {
          "category": groupCat?.toString().split("/")[1] || '',
          "kategori": kumpulanKat?.toString().split("/")[1] || ''
        };
      })
      .filter(obj => 
        obj.category && 
        !lookup.has(obj.category) && 
        this.isGroupCategoryInRelease(this.formatString(group), this.formatString(obj.category)) && 
        lookup.add(obj.category)
      );

    console.log(`Categories for group "${group}":`, categories);
    return categories;
  }

  // get vocabItem with splitted group&category pairs
  getVocabItem() {
    const splitGroupCategory = a => a !== undefined && a.toString().split(",");
    return this.getVocabsItems().map(o => {
      // Handle both camelCase and PascalCase properties
      const groupCategory = o.groupCategory || o.GroupCategory || '';
      return { ...o, groupCategory: splitGroupCategory(groupCategory) };
    });
  }

  // get vocabs list based on Category and Group
  getVocabList(groupEng, categoryEng) {
    const groupCategoryPair = groupEng + "/" + categoryEng;

    // check if a vocab belongs to the group&category pair
    const isInGroupCategory = a => {
      if (!a) return false;
      var isGroup = false;
      for (let i = 0; i < a.length; i++) {
        if (a[i] && !((this.formatGroupCategory(a[i].toString())).localeCompare(groupCategoryPair))) {
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
    if (!groupEng) return false;
    
    const vocabs = this.getVocabsItems();
    for (let obj of vocabs) {
      const groupCategory = obj.groupCategory || obj.GroupCategory;
      if (groupCategory !== undefined &&
        !this.formatString(groupCategory.toString().split("/")[0]).localeCompare(
          (groupEng)
        )) {
        return true;
      }
    }
    return false;
  }

  // check if a group&category pair is in release
  isGroupCategoryInRelease(groupEng, categoryEng) {
    if (!groupEng || !categoryEng) return false;
    
    const vocabs = this.getVocabItem();
    for (let obj of vocabs) {
      if (!obj.groupCategory) continue;
      
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
    if (!signEng) return [];
    
    const vocabs = this.getVocabsItems().filter(
      (category) => {
        const word = category.word || category.Word;
        return word && 
          !this.formatString(word).localeCompare(
            this.formatString(signEng)
          );
      }
    );
    return vocabs;
  }

  // get Top 3 Commonly Referred Groups to display in Home page
  // look for Remark with 'Home' in Group Excel
  getGroupsHome() {
    let groups = this.getGroups()
      .filter(group => 
        group?.remark?.trim()?.toLowerCase() === "home" // Safe navigation and trimming
      );

    const newSignsIndex = groups.findIndex(item => 
      item?.group === "New Signs"
    );
    
    if (newSignsIndex > -1) {
      groups.push(groups.splice(newSignsIndex, 1)[0]);
    }
  
    return groups;
  }

  // format string to lower case, replace space with dash, and remove '?' and '/' (for link path name)
  formatString(string) {
    if (!string) return '';
    
    try {
      var stringFormatted = string.toLowerCase().replace(/\s+/g, "-")
      stringFormatted = stringFormatted.replace(/[?/]/g, "")
      return stringFormatted
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

  // get vocabs through matching first alphabet
  getVocabsAlphabet(alphabetFirst) {
    if (!alphabetFirst) return [];
    
    const vocabAlpha = this.getVocabsItems().filter((vocAl) =>
      getCurrentLocale() === "ms"
        ? (vocAl.perkataan || vocAl.Perkataan) && this.formatString(vocAl.perkataan || vocAl.Perkataan).startsWith(alphabetFirst)
        : (vocAl.word || vocAl.Word) && this.formatString(vocAl.word || vocAl.Word).startsWith(alphabetFirst)
    )
    .sort((a, b) => {
      if (cookies.get("i18next") === "ms") {
        return (a.perkataan || a.Perkataan).localeCompare(b.perkataan || b.Perkataan);
      } else {
        return (a.word || a.Word).localeCompare(b.word || b.Word);
      }
    });
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
