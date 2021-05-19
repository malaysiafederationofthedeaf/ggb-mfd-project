import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import Dispatcher from "../flux/dispatcher";
import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import SidebarCategory from "../components/layout/SidebarCategory/SidebarCategory";
import ChildrenFooter from "./Children-Footer";

const SideCategoryLayout = ({ children, noNavbar, noFooter }) => {
  const search = (e) => {
    Dispatcher.dispatch({
      actionType: "SEARCH_TERM",
      payload: e,
    });
  };
  
  const showSearch = () => {
    Dispatcher.dispatch({
      actionType: "OPEN_SEARCH",
    });
  };

  const closeSearch = () => {
    Dispatcher.dispatch({
      actionType: "CLOSE_SEARCH",
    });
  };  

  const toggleDropdown = () => {
    Dispatcher.dispatch({
      actionType: "TOGGLE_DROPDOWN",
    });
  };  
 
  return(    
    <Container fluid>
      <Row>
        <Col
          className="main-content p-0"
          tag="main"
        >
          {!noNavbar && (
            <MainNavbar
            toggle={toggleDropdown} 
            onChange={search}
            onFocus={showSearch}
            onBlur={closeSearch}
            />
          )}   
          <Row>
            <Col xl="2" lg="3" md="3" sm="4">          
              <div className="sidebar-category-wrapper">
                <SidebarCategory />
              </div>
            </Col>
            <Col xl="10" lg="9" md="9" sm="8">
              <ChildrenFooter children={children} noFooter={noFooter}/>       
            </Col>
          </Row>       
        </Col>
      </Row>
    </Container>  
);
}

SideCategoryLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool
};

SideCategoryLayout.defaultProps = {
  noNavbar: false,
  noFooter: false
};

export default SideCategoryLayout;
