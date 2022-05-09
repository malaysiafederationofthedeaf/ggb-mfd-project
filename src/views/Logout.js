/* global google */
// import React, { useState } from "react";
// import { GoogleLogout } from "react-google-login";
// import jwt_decode from "jwt-decode";
import "../App.css";
// import Login from './Login';

const Logout = (props) => {
    
    google.accounts.id.disableAutoSelect();
    sessionStorage.setItem("email",null);
    console.log(sessionStorage.getItem("email"))
    //window.location.reload();
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
