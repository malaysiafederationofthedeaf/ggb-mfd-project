import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Nav, NavItem, NavLink } from "shards-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MainFooter = ({ contained, menuItems }) => {
  const { t } = useTranslation();
  return (
    <footer className="main-footer d-flex p-2 px-3 bg-white border-top">
      <Container fluid={contained}>
        <Row>
          <Nav>
            {menuItems.map((item, idx) => (
              <NavItem key={idx}>
                <NavLink tag={Link} to={item.to}>
                  {t(item.title)}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </Row>
      </Container>
    </footer>
  );
};

MainFooter.propTypes = {
  /**
   * Whether the content is contained, or not.
   */
  contained: PropTypes.bool,
  /**
   * The menu items array.
   */
  menuItems: PropTypes.array,
};

MainFooter.defaultProps = {
  contained: false,
  menuItems: [
    {
      title: "nav_item_1_title",
      to: "/home",
    },
    {
      title: "nav_item_2_title",
      to: "/about-us",
    },
    {
      title: "nav_item_3_title",
      to: "/browse-by-category",
    },
  ],
};

export default MainFooter;
