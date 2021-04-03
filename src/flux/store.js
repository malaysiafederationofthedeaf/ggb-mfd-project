import { EventEmitter } from "events";

import Dispatcher from "./dispatcher";
import Constants from "./constants";
import getSidebarNavItems from "../data/sidebar-nav-items";
import signSample from "../data/sign-sample/sign-sample-items";

let _store = {
  menuVisible: false,
  navItems: getSidebarNavItems(),
  signSampleItems: signSample,
  searchTerm: "",
  signListVisible: false,
};

class Store extends EventEmitter {
  constructor() {
    super();

    this.registerToActions = this.registerToActions.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.searchTerm = this.searchTerm.bind(this);

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

  getMenuState() {
    return _store.menuVisible;
  }

  getSearchState() {
    return _store.signListVisible;
  }

  getSidebarItems() {
    return _store.navItems;
  }

  getSignItems() {
    return _store.signSampleItems;
  }

  getSearchTerm() {
    return _store.searchTerm;
  }

  addChangeListener(callback) {
    this.on(Constants.CHANGE, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(Constants.CHANGE, callback);
  }
}
export default new Store();
