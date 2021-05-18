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
              <div className={(window.location.pathname).localeCompare(`/${item.categoryGroup}`) ? "inactive" : "active"} >
                <Link to={`/${item.categoryGroup}`} >              
                  {t(item.categoryGroup)}  
                </Link> 
                <DropdownToggle nav caret className="d-inline" />
                <DropdownMenu className="dropdown-menu">
                    {t(item.categoryGroup) &&  item.categories.map((item1, key) => (                   
                      <div key={key}>                      
                        {useEffect(() => {(window.location.pathname).includes(`/${item.categoryGroup}/${item1.title.toLowerCase()}`) && setDropdownOpen(true) }, [])}                        
                        <DropdownItem  href={`/${item.categoryGroup}/${item1.title.toLowerCase()}`}>                        
                          <span className={(window.location.pathname).includes(`/${item.categoryGroup}/${item1.title.toLowerCase()}`) ? "active" : "inactive"}>{t(item1.title)}</span>                          
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
