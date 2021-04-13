import React from 'react';
import { withRouter } from 'react-router-dom';

const NavbarBackButton = ({ history }) => 
<button className="navbar-back-button" onClick={() => history.goBack()}>
    <i className="material-icons">arrow_back</i>    
</button>

export default withRouter(NavbarBackButton);
