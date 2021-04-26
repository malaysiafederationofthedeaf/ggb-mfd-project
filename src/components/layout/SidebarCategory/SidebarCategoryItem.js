import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Nav, Navbar } from "shards-react";
import { useTranslation } from "react-i18next";

const SidebarCategoryItem = ({ item }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);      
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  }

  const { t } = useTranslation();

  return(
    <Navbar>    
      <Nav navbar>
          <Dropdown
              open={dropdownOpen}
              toggle={toggleDropdown}             
            >
              <div className={(window.location.pathname).localeCompare(`/group/${item.categoryGroup}`) ? "inactive" : "active"} >
                <Link to={`/group/${item.categoryGroup}`} >              
                  {t(item.categoryGroup)}  
                </Link> 
                <DropdownToggle nav caret className="d-inline" />
                <DropdownMenu className="dropdown-menu">
                    {t(item.categoryGroup) &&  item.categories.map((item1, key) => (                   
                      <div key={key}>                      
                        {useEffect(() => {!(window.location.pathname).localeCompare(`/category/${item1.titleEn.toLowerCase()}`) && setDropdownOpen(true) }, [])}
                        <DropdownItem  href={`/category/${item1.titleEn.toLowerCase()}`}>
                          <span className={(window.location.pathname).localeCompare(`/category/${item1.titleEn.toLowerCase()}`) ? "inactive" : "active"}>{t(item1.title)}</span>
                        </DropdownItem>
                      </div>
                    ))} 
                </DropdownMenu>
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

export default SidebarCategoryItem;
