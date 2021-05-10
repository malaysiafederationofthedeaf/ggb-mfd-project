import React from "react";
import PropTypes from "prop-types";
import { Container, Nav, NavItem, NavLink } from "shards-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MainFooter = ({ contained, menuItems, copyright, footerLinks }) => {
  const { t } = useTranslation();
  return (
    <footer className="main-footer d-flex p-2 px-3 bg-white border-top">
      <Container fluid={contained}>
          <Nav>
            {menuItems.map((item, key) => (
              <NavItem key={key}>
                <NavLink tag={Link} to={item.to}>
                  {t(item.title)}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          <span className="copyright ml-auto my-auto mr-2">
            {t(copyright)}
          </span>
          <div className="footer-logo d-inline ml-auto my-auto mr-2">
            {footerLinks.map((link, key) => 
              <a href={link.href} key={key}>
                <img
                  src={link.imgSrc}
                  alt={link.imgAlt}
                />         
              </a>         
            )}   
          </div>
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
  /**
   * The copyright info.
   */
   copyright: PropTypes.string,
  /**
   * The footer links array.
   */
   footerLinks: PropTypes.array,   
};

MainFooter.defaultProps = {
  contained: false,
  copyright: "copyright",
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
  footerLinks: [
    {
      href: "https://www.facebook.com/BahasaIsyaratMalaysiaMFD/",
      imgSrc: require("../../images/general/logo/fb-logo.jpg"),
      imgAlt: "FB Logo",
    },
    {
      href: "https://www.instagram.com/mfd.2020/",
      imgSrc: require("../../images/general/logo/ig-logo.jpg"),
      imgAlt: "IG Logo",
    }, 
    {
      href: "https://www.youtube.com/channel/UCcTR3G_8WDv3V7MqnYtN1gw",
      imgSrc: require("../../images/general/logo/youtube-logo.jpg"),
      imgAlt: "Youtube Logo",
    },     
  ]
};

export default MainFooter;
