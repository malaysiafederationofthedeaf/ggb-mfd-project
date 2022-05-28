import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// views component
// import { ExcelUploader } from './views/ExcelUploader';
// import { Preview } from './views/ExcelPreview';
// import { ImageUpload } from './views/ImageUpload';
// import Logout from './views/Logout';
//import Navbar from "./views/Navbar.js";

import './App.css';

const signout = () => {
  console.log("signout button clicked");

  sessionStorage.setItem('email',null);
  window.location.replace('http://localhost:3000/admin');
};

function Dashboard() {

    return (
      <div className="App">
        {console.log("[Dashboard] "+sessionStorage.getItem("email"))}
        
        <br/><br/><br/><br/><br/><br/><br/>
        <h1>Welcome To BIM Sign Bank Administration</h1><br/>
        <br/>
        <Link id="button-link" to="/admin" onClick={signout}>
            <div className="imageButton" >
                Sign Out
            </div><br/>
          </Link>
      </div>
    );
}

export default Dashboard;