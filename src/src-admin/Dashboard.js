import React, { useState } from 'react';
import {BrowserRouter, Route, Link, Switch} from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// views component
import { ExcelUploader } from './views/ExcelUploader';
import { Preview } from './views/ExcelPreview';
import { ImageUpload } from './views/ImageUpload';
import Logout from './views/Logout';
import Navbar from "./views/Navbar.js";

import './App.css';

function App() {

    var [excel, setExcel] = useState([]);
    const [files, setFiles] = useState([]);
    const onSuccess = (savedFiles) => {
        setFiles(savedFiles)
    };

    return (
      <div className="App">
  {console.log("[App] "+sessionStorage.getItem("email"))}
  
        <BrowserRouter>
        <Navbar/>
        
          <h1>BIM Sign Bank Administrative Page </h1><br></br>

          <Link id="button-link" to="/Excel" onClick={ExcelUploader}>
            <div className="excelButton" >
              Upload Excel
            </div><br/>
          </Link><br/><br/>

          <Link id="button-link" to="/ImageUploader" onClick={ImageUpload}>
            <div className="imageButton" >
                Upload Image
            </div><br/>
          </Link>

          <Switch>
            <Route path="/preview" element = {<Preview files={files}/>} />
            <Route path="/Excel" element   = {<ExcelUploader onSuccess={onSuccess}/>} />
            <Route path="/ImageUploader" element = {<ImageUpload onSuccess={excel} />} />
            <Route exact path="/Logout" element  = {<Logout/>} />
          </Switch>
        </BrowserRouter>
        <ToastContainer/>
      </div>
    );
}

export default App;