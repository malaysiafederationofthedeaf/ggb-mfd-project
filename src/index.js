import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './views/Login';
import App from './App';


ReactDOM.render(
  <React.StrictMode>
    {console.log("[Index] "+sessionStorage.getItem("email"))}
    {sessionStorage.getItem('email')!=="null"?<App />:<Login />}
    {/* <App /> */}
    {/* <Login /> */}
  </React.StrictMode>,
  document.getElementById('root')
);
