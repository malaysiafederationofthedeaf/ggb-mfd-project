/* global google */
// import React, { useState } from "react";
// import { GoogleLogout } from "react-google-login";
// import jwt_decode from "jwt-decode";
import React from "react";

import "../App.css";
import Dashboard from "../Dashboard";

import Login from './Login';

const Logout = (props) => {

    console.log("[Logout] sessionStorage: "+sessionStorage.getItem("email"));
    
    // google.accounts.id.disableAutoSelect();
    sessionStorage.setItem("email",null);
    console.log(sessionStorage.getItem("email"));
    window.location.reload();

    if (sessionStorage.getItem("email")==='null' || sessionStorage.getItem("email")===null) {
        console.log("Redirect to Login page");
        return <Login />
      }else {
      console.log("Redirect to Dashboard page");
      return <Dashboard />
      }

//   const [isSignedIn, setIsSignedIn] = useState(false);
//   const [userInfo, setUserInfo] = useState(null);
//   const [other, setOther] = useState(null);


//   const signout = () => {
//     // refresh the page
//     google.accounts.id.disableAutoSelect();
//     sessionStorage.setItem("email",null);
//     window.location.reload();
//   };

//   return (
//     <div>
//         {isSignedIn ? (
//             <div>
//                 <div onClick={() => signout()}>
//                     <GoogleLogout buttonText="Sign Out" theme="dark"/>
//                 </div>
//             </div>
//         ) : (
//                 //redirect to Login page
//                 <Login/>
//             )
//         }
//    </div>
// );
};

export default Logout;
