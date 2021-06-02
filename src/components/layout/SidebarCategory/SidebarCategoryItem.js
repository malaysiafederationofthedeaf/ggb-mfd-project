import React, { useEffect, useState } from "react";
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

  return (
    <Navbar>
      <Nav navbar>
        <Dropdown open={dropdownOpen} toggle={toggleDropdown}>
          {/* set className to active to highlight current active Group in Side Navbar */}
          <div
            className={
              window.location.pathname.localeCompare(
                !param ? `/groups/${groupFormatted}` : `/alphabets/${param}`
              )
                ? "inactive"
                : "active"
            }
          >
            {/* render according to the url parameter passed */}
            {!param ? (
              <>
                <Link to={`/groups/${groupFormatted}`}>
                  {t(groupFormatted)}
                </Link>{" "}
                <DropdownToggle nav caret className="d-inline" />
                <DropdownMenu className="dropdown-menu">
                  {item.group &&
                    items.map((item1, key) => (
                      <div key={key}>
                        {/* open dropdown to show current active Category in Side Navbar */}
                        {useEffect(() => {
                          window.location.pathname.includes(
                            `/groups/${groupFormatted}/${Store.formatString(
                              item1.category
                            )}`
                          ) && setDropdownOpen(true);
                        }, [])}

                        <DropdownItem
                          href={`/groups/${groupFormatted}/${Store.formatString(
                            item1.category
                          )}`}
                        >
                          {/* set className to active to highlight current active Category in Side Navbar */}
                          <span
                            className={
                              window.location.pathname.includes(
                                `/groups/${groupFormatted}/${Store.formatString(
                                  item1.category
                                )}`
                              )
                                ? "active"
                                : "inactive"
                            }
                          >
                            {t(Store.formatString(item1.category))}
                          </span>
                        </DropdownItem>
                      </div>
                    ))}
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  to={`/alphabets/${param}`}
                  className="text-decoration-none"
                >
                  {alpha.toUpperCase()}
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
