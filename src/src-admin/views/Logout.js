import "../App.css";
// import Login from './Login';

const Logout = () => {
    sessionStorage.setItem('email',null);
    const redirect = window.location.protocol + "//" + window.location.host + "/admin";
    window.location.assign(redirect);
};


export default Logout;