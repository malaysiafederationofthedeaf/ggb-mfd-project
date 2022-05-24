import Login from "./views/Login";
import Dashboard from "./Dashboard";

function App() {
  console.log("[App] sessionStorage: "+sessionStorage.getItem("email"));
  // console.log(sessionStorage.getItem("email")+ " === 'null': ", sessionStorage.getItem("email")==='null');
  // console.log(sessionStorage.getItem("email")+ " === ''null''", sessionStorage.getItem("email")==="null");
  // console.log(sessionStorage.getItem("email")+ " === null:" ,sessionStorage.getItem("email")===null);

  if (sessionStorage.getItem("email")==='null' || sessionStorage.getItem("email")===null) {
      console.log("Redirect to Login page");
      return <Login />
    }else {
    console.log("Redirect to Dashboard page");
    return <Dashboard />
    }
}

export default App;