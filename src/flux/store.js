import { EventEmitter } from "events";

import Dispatcher from "./dispatcher";
import Constants from "./constants";
import getSidebarNavItems from "../data/sidebar-nav-items";
import getAlphabets from "../data/alphabets/alphabets-items";
import getCurrentLocale from "../data/alphabets/currentLocale";
import signSample from "../data/sign-sample/sign-sample-items";

let _store = {
  menuVisible: false,
  navItems: getSidebarNavItems(),
  vocabsItems: [],
  signSampleItems: signSample,
  signListVisible: false,
  openDropdown: false,
  alphabets: getAlphabets(),
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
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.storeExcel = this.storeExcel.bind(this);

    Dispatcher.register(this.registerToActions.bind(this));
  }

  registerToActions({ actionType, payload }) {
    switch (actionType) {
      case Constants.TOGGLE_SIDEBAR:
        this.toggleSidebar();
        break;

      case "TOGGLE_DROPDOWN":
        this.toggleDropdown();
        break;

      case "STORE_EXCEL":
        this.storeExcel(payload);
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

  storeExcel(value) {
    _store.vocabsItems = value;
    this.emit(Constants.CHANGE);
  }

  getVocabsItems() {
    return _store.vocabsItems;
  }

  getMenuState() {
    return _store.menuVisible;
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

  getOpenDropdown() {
    return _store.openDropdown;
  }

  getAlphabetsList() {
    return _store.alphabets;
  }

  getLanguages() {
    return _store.languages;
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

  // get image for Sign Word (fileName naming std: kategori/perkataan.jpg)
  getSignImgSrc(kategori, perkataan) {
    try {
      return require(`../images/bim/vocab/${kategori}/${perkataan}.jpg`);
    } catch (err) {
      //default img (placeholder only)*
      return require(`../images/general/image-coming-soon.jpg`);
    }
  }

  // get all the (unique) Groups
  getGroups() {
    let lookup = new Set();
    const groups = this.getVocabsItems().filter(
      (obj) => !lookup.has(obj.group) && lookup.add(obj.group)
    );
    return groups;
  }

  // get all the (unique) Categories
  getCategories() {
    let lookup = new Set();
    const groups = this.getVocabsItems().filter(
      (obj) => !lookup.has(obj.category) && lookup.add(obj.category)
    );
    return groups;
  }

  // get category list based on Group
  getCategoriesOfGroup(group) {
    let lookup = new Set();
    const categories = this.getVocabsItems()
      .filter(
        (category) =>
          !this.formatString(category.group).localeCompare(
            this.formatString(group)
          )
      )
      .filter((obj) => !lookup.has(obj.category) && lookup.add(obj.category));
    return categories;
  }

  // get vocabs list based on Category and Group
  getVocabList(groupEng, categoryEng) {
    const vocabs = this.getVocabsItems().filter(
      (category) =>
        !this.formatString(category.group).localeCompare(
          this.formatString(groupEng)
        ) &&
        !this.formatString(category.category).localeCompare(
          this.formatString(categoryEng)
        )
    );
    return vocabs;
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
  // look for Tag with 'Home' in Excel
  getTop3Groups() {
    return this.getGroups().filter(
      (group) => group.tag !== undefined && !group.tag.localeCompare("Home")
    );
  }

  // format string to lower case and replace space with dash (for link path name)
  formatString(string) {
    try {
      return string.toLowerCase().replace(/\s+/g, "-");
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
    );
    return vocabAlpha;
  }

  addChangeListener(callback) {
    this.on(Constants.CHANGE, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(Constants.CHANGE, callback);
  }
}
export default new Store();
