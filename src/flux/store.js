import { EventEmitter } from "events";

import Dispatcher from "./dispatcher";
import Constants from "./constants";
import getSidebarNavItems from "../data/sidebar-nav-items";
import allVocabsItems from "../data/categories/all-vocabs-items";
import signSample from "../data/sign-sample/sign-sample-items";

let _store = {
  menuVisible: false,
  navItems: getSidebarNavItems(),
  vocabsItems: allVocabsItems,
  signSampleItems: signSample,
  searchTerm: "",
  signListVisible: false,
  openDropdown: false,
  languages: [
    {
      code: "en",
      name: "English",
      country_code: "gb",
    },
    {
      code: "ms",
      name: "Melayu",
      country_code: "my",
    },
  ],
};

class Store extends EventEmitter {
  constructor() {
    super();

    this.registerToActions = this.registerToActions.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.searchTerm = this.searchTerm.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);

    Dispatcher.register(this.registerToActions.bind(this));
  }

  registerToActions({ actionType, payload }) {
    switch (actionType) {
      case Constants.TOGGLE_SIDEBAR:
        this.toggleSidebar();
        break;

      case "TOGGLE_SEARCH":
        this.toggleSearch();
        break;

      case "SEARCH_TERM":
        this.searchTerm(payload);
        break;

      case "TOGGLE_DROPDOWN":
        this.toggleDropdown();
        break;

      default:
    }
  }

  toggleSidebar() {
    _store.menuVisible = !_store.menuVisible;
    this.emit(Constants.CHANGE);
  }

  toggleSearch() {
    _store.signListVisible = !_store.signListVisible;
    this.emit(Constants.CHANGE);
  }

  searchTerm(e) {
    _store.searchTerm = e.target.value;
    this.emit(Constants.CHANGE);
  }

  toggleDropdown() {
    _store.openDropdown = !_store.openDropdown;
    this.emit(Constants.CHANGE);
  }

  getMenuState() {
    return _store.menuVisible;
  }

  getSearchState() {
    return _store.signListVisible;
  }

  getSidebarItems() {
    return _store.navItems;
  }

  getSidebarVocabItems() {
    return _store.vocabsItems;
  }

  getSignItems() {
    return _store.signSampleItems;
  }

  getSearchTerm() {
    return _store.searchTerm;
  }

  getOpenDropdown() {
    return _store.openDropdown;
  }

  getLanguages() {
    return _store.languages;
  }

  getCategoryImgSrc(categoryMalay) {
    try{
      return require(`../images/bim/category/${categoryMalay.replace(/\s+/g, "-").toLowerCase()}.jpg`);
    }
    catch(err){
      //default img (placeholder only)*
      return require(`../images/bim/category/abjad.jpg`);
    }       
  }

  getSignImgSrc(signMalay) {
    try{
      return require(`../images/bim/vocab/${signMalay.replace(/\s+/g, "-").toLowerCase()}.jpg`);
    }
    catch(err){
      //default img (placeholder only)*
      return require(`../images/bim/vocab/hai.jpg`);
    }    
  }

  getVocabList(categoryEng) {
    for (let group of allVocabsItems){
      for (let category of group['categories']){
        if(category['titleEn'].toString().toLowerCase() === categoryEng){
          return category;
        }
      }
    }
  }

  getVocabDetail(categoryEng, signEng) {
    for (let group of allVocabsItems){
      for (let category of group['categories']){
        if(category['titleEn'].toString().toLowerCase() === categoryEng){   
          var categoryMatch = category;         
          for (let vocab of category['vocabs']){
            if(vocab['word'].toString().toLowerCase() === signEng){
              return {
                category: categoryMatch,
                vocab: vocab,
              };
            }
          }
        }
      }
    }
  }

  addChangeListener(callback) {
    this.on(Constants.CHANGE, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(Constants.CHANGE, callback);
  }
}
export default new Store();
