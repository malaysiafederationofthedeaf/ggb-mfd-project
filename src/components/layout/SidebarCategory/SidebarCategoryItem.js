import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
  Navbar,
  Fade
} from "shards-react";
import { useTranslation } from "react-i18next";

import { Store } from "../../../flux";

const SidebarCategoryItem = ({ item, alpha, param }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const { t } = useTranslation("group-category");
  const isNewSign = !param && item.group === "New Signs";
  const items = !param && !isNewSign ? Store.getCategoriesOfGroup(item.group) : [];
  const groupFormatted = !param ? Store.formatString(item.group) : null;
  const basePath = `/groups/${groupFormatted}`

  const className = {
    ACTIVE: "active",
    INACTIVE: "inactive"
  }

  const isDropDownActive = () => {
    return window.location.pathname.search(
      !param ? `${basePath}` : `/alphabets/${param}`
    )
      ? className.INACTIVE
      : className.ACTIVE
  }

  const isDropDownItemActive = (item) => {
    return window.location.pathname.includes(`${basePath}/${Store.formatString(item.category)}`)
      ? className.ACTIVE
      : className.INACTIVE
  }

  return (
    <Navbar>
      <Nav navbar>
        <Dropdown open={dropdownOpen} toggle={toggleDropdown}>
          {/* set className to active to highlight current active Group in Side Navbar */}
          <div className={isDropDownActive()}>
            {/* render according to the url parameter passed */}
            {!param ? (
              <>
                {items.length > 0 && <DropdownToggle nav caret />}
                <Link to={`${basePath}`}>
                  <div>
                    {t(groupFormatted)}
                  </div>
                </Link>
                <Fade in={isDropDownActive() === className.ACTIVE || dropdownOpen}>
                  <DropdownMenu>
                    {
                      item.group &&
                      items.map((item1, key) => (
                        <DropdownItem key={key} className={isDropDownItemActive(item1)}>
                          {/* set className to active to highlight current active Category in Side Navbar */}
                          <Link to={`${basePath}/${Store.formatString(item1.category)}`}>
                            {t(Store.formatString(item1.category))}
                          </Link>
                        </DropdownItem>
                      ))}
                  </DropdownMenu>
                </Fade>
              </>
            ) : (
              <>
                <Link
                  to={`/alphabets/${alpha}`}
                  className="text-decoration-none"
                >
                  <div>
                    {alpha.toUpperCase()}
                  </div>
                </Link>
                <DropdownToggle nav className="d-inline" />
              </>
            )}
          </div>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

SidebarCategoryItem.propTypes = {
  /**
   * The item object.
   */
  item: PropTypes.object,
};

SidebarCategoryItem.defaultProps = {
  param: null,
  item: null,
};

export default SidebarCategoryItem;
