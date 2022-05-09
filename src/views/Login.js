/* global google */
import React, { useState, useEffect } from "react";
import GoogleLogin /* , { GoogleLogout } */ from "react-google-login";
import jwt_decode from "jwt-decode";
import "../App.css";
import App from '../App';

const Login = (props) => {
  console.log("[Login] "+sessionStorage.getItem('email'));
  

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [other, setOther] = useState(null);

  const onOneTapSignedIn = (response) => {
    setIsSignedIn(true);
    const decodedToken = jwt_decode(response.credential);
    setUserInfo({ ...decodedToken });
  };
  // const signout = () => {
  //   // refresh the page
  //   google.accounts.id.disableAutoSelect();
  //   sessionStorage.setItem('email',null);
  //   window.location.reload();
  // };

  const onSuccess = (res) => {
    let userInfo   = {};
    let profileObj = res.profileObj;
    userInfo.name  = profileObj.name;
    userInfo.email = profileObj.email;
    // console.log("[1]Account check: ", userInfo.email);
    if (userInfo.email === 'athirahsn.hassan@gmail.com') {
      setUserInfo({...userInfo});
      setIsSignedIn(true);
      sessionStorage.setItem("email",userInfo.email);
    } else {
      setUserInfo({...userInfo});
      setIsSignedIn(true);
      console.log("[Login]Unauthorized access attempted by " + userInfo.name + "(" + userInfo.email + ")");
      window.alert("Your account is not authorized to access this page.")
      window.location.reload();
    }
  };

  const onFailure = (res) => {
    console.log("Login failed: res:", res);
    //alert(`Failed to login.`);
  };

  useEffect(() => {
    window.onGoogleLibraryLoad = () => {
      google.accounts.id.initialize({
        client_id: "140281256136-sn8u0oviifv4smqdo1meltjv4n58bjrf.apps.googleusercontent.com",
        cancel_on_tap_outside: false,
        callback: onOneTapSignedIn,
      });
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.log(notification.getNotDisplayedReason());
          setOther(1);
        } else if (notification.isSkippedMoment()) {
          console.log(notification.getSkippedReason());
          setOther(1);
        } else if (notification.isDismissedMoment()) {
          console.log(notification.getDismissedReason());
        } else {
          setOther(0);
        }
      });
      google.accounts.id.renderButton({
        type: "standard",
        client_id: "140281256136-sn8u0oviifv4smqdo1meltjv4n58bjrf.apps.googleusercontent.com",
        cancel_on_tap_outside: false,
        prompt_parent_id: "g_id_onload",
      });
    };
  });

  return (
    <div>
        <div>
            {other === 1 ? (
                <div>
                    {/* { if signed in: show page App, else show login button */
                    isSignedIn ? (
                        <div>
                            {/* {if correct account: grant access, else no access} */
                            userInfo.email === 'athirahsn.hassan@gmail.com' ? (
                              <div>
                                {/* <p>Hello {userInfo.name} ({userInfo.email})</p> */}
                                <App />
                                {/* <div onClick={() => signout()}>
                                  <GoogleLogout buttonText="Sign Out" theme="dark"/>
                                </div> */}
                              </div>
                            ) : ("")
                            }
                        </div>
                    ) : (
                        <div>
                          <div>
                            <h2><code>BIM Sign Bank Administrative Page</code></h2>
                          </div>
                          <div>
                          <GoogleLogin
                              clientId="140281256136-sn8u0oviifv4smqdo1meltjv4n58bjrf.apps.googleusercontent.com"
                              onSuccess={onSuccess}
                              cookiePolicy={"single_host_origin"}
                              //isSignedIn={true}
                              theme="dark"
                              onFailure={onFailure}
                              buttonText="Sign in your account with Google"
                          />
                          </div>
                        </div>
                        )
                    } 

                </div>
            ) : ("-")}
        </div>
   </div>
);
};

export default Login;
