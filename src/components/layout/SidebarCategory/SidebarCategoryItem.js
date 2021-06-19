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
} from "shards-react";
import { useTranslation } from "react-i18next";

import { Store } from "../../../flux";

const SidebarCategoryItem = ({ item, alpha, param }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const { t } = useTranslation("group-category");
  const items = !param ? Store.getCategoriesOfGroup(item.group) : null;
  const groupFormatted = !param ? Store.formatString(item.group) : null;

  const isDropDownActive = () => {
    return window.location.pathname.search(
      !param ? `/groups/${groupFormatted}` : `/alphabets/${param}`
    )
      ? "inactive"
      : "active"
  }

  const isDropDownItemActive = (category) => {
    return window.location.pathname.includes(
      `/groups/${groupFormatted}/${Store.formatString(
        category
      )}`
    )
      ? "active"
      : "inactive"
  }

  return (
    <Navbar>
      <Nav navbar>
        <Dropdown open={dropdownOpen} toggle={toggleDropdown}>
          {/* set className to active to highlight current active Group in Side Navbar */}
          <div className={isDropDownActive()} >
            {/* render according to the url parameter passed */}
            {!param ? (
              <>
                <Link to={`/groups/${groupFormatted}`}>
                  <div>
                  {t(groupFormatted)}
                  <DropdownToggle nav caret className="d-inline" />
                  </div>
                </Link>
                <DropdownMenu>
                  {item.group &&
                    items.map((item1, key) => (
                      <DropdownItem key={key} className={isDropDownItemActive(item1.category)}>
                        {/* set className to active to highlight current active Category in Side Navbar */}
                        <Link
                          to={`/groups/${groupFormatted}/${Store.formatString(item1.category)}`}
                        >
                          {t(Store.formatString(item1.category))}
                        </Link>
                      </DropdownItem>
                    ))}
                </DropdownMenu>
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
