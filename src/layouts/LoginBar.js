import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import Dispatcher from "../flux/dispatcher";
import MainNavbar from "../components/layout/LoginNavbar/MainNavbar";
import MainFooter from "../components/layout/MainFooter";

const LoginBar = ({ children, noNavbar, noFooter }) => {
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
              toggle={toggleDropdown} 
            />
          )}
          <div className="main-content-wrapper">
            { children }
          </div>
          {!noFooter && <MainFooter />}
        </Col>
      </Row>
    </Container>
  );
};

LoginBar.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool,
};

LoginBar.defaultProps = {
  noNavbar: false,
  noFooter: false,
};

export default LoginBar;
