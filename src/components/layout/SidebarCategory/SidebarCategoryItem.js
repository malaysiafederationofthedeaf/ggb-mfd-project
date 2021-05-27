import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Nav, Navbar } from "shards-react";
import { useTranslation } from "react-i18next";

import { Store } from "../../../flux";

const SidebarCategoryItem = ({ item }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);      
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  }

  const { t } = useTranslation('group-category');
  const items = Store.getCategoriesOfGroup(item.group);
  const groupFormatted = Store.formatString(item.group);

  return(
    <Navbar>    
      <Nav navbar>
          <Dropdown
              open={dropdownOpen}
              toggle={toggleDropdown}             
            >
              {/* set className to active to highlight current active Group in Side Navbar */}
              <div className={(window.location.pathname).localeCompare(`/${groupFormatted}`) ? "inactive" : "active"} >
                <Link to={`/${groupFormatted}`} >              
                  {t(groupFormatted)}  
                </Link> 
                <DropdownToggle nav caret className="d-inline" />
                <DropdownMenu className="dropdown-menu">
                    {item.group &&  items.map((item1, key) => (                   
                      <div key={key}>  
                        {/* open dropdown to show current active Category in Side Navbar */}                                          
                        {useEffect(() => {(window.location.pathname).includes(`/${groupFormatted}/${Store.formatString(item1.category)}`) && setDropdownOpen(true) }, [])}    

                        <DropdownItem  href={`/${groupFormatted}/${Store.formatString(item1.category)}`}>   
                          {/* set className to active to highlight current active Category in Side Navbar */}                                             
                          <span className={(window.location.pathname).includes(`/${groupFormatted}/${Store.formatString(item1.category)}`) ? "active" : "inactive"}>{t(Store.formatString(item1.category))}</span>                          
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
