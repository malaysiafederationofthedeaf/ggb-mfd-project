import React from 'react';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';

// const signout = () => {
//   sessionStorage.setItem('email',null);
//   const redirect = window.location.protocol + "//" + window.location.host + "/admin";
//   window.location.assign(redirect);
// };

function Dashboard() {

    return (
      <div className="App">
        <br/><br/><br/><br/>
        <h1>Welcome to BIM Sign Bank<br></br>Administration Homepage</h1><br/>
        <br/>
        {/* <Link id="button-link" to="/admin" onClick={signout}>
            <div className="imageButton" >
                Sign Out
            </div><br/>
          </Link> */}
      </div>
    );
}

export default Dashboard;