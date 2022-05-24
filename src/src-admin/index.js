import React from 'react';
import ReactDOM from 'react-dom';

import Dashboard from './Dashboard';
import Login from './views/Login';

import './index.css';

ReactDOM.render(
  <React.StrictMode>
    {console.log("[Index] "+sessionStorage.getItem("email"))}
    
    {sessionStorage.getItem('email') === 'null' || sessionStorage.getItem('email') === null ? <Login /> : <Dashboard />}
    
    {/* <App /> */}
    {/* <Login /> */}
  </React.StrictMode>,
  document.getElementById('root')
);
