import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import Dispatcher from "../flux/dispatcher";
import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import MainFooter from "../components/layout/MainFooter";

const DefaultLayout = ({ children, noNavbar, noFooter }) => {
  const search = (e) => {
    Dispatcher.dispatch({
      actionType: "SEARCH_TERM",
      payload: e,
    });
  };
  const showSearch = () => {
    Dispatcher.dispatch({
      actionType: "TOGGLE_SEARCH",
    });
  };
  const toggleDropdown = () => {
    Dispatcher.dispatch({
      actionType: "TOGGLE_DROPDOWN",
    });
  };

  return (
    <Container fluid>
      <Row>
        <Col
          className="main-content p-0"
          tag="main"
        >
          {!noNavbar && (
            <MainNavbar
              onChange={search}
              onFocus={showSearch}
              toggle={toggleDropdown}
            />
          )}
          {children}
          {!noFooter && <MainFooter />}
        </Col>
      </Row>
    </Container>
  );
};

DefaultLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool,
};

DefaultLayout.defaultProps = {
  noNavbar: false,
  noFooter: false,
};

export default DefaultLayout;
