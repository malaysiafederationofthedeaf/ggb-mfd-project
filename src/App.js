import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import routes from "./routes";
import withTracker from "./withTracker";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/App.scss";
import Aos from "aos";
import "aos/dist/aos.css";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
  Aos.init();
  return (
      <Router basename={process.env.REACT_APP_BASENAME || ""}>
          <div>
          <ScrollToTop>
            <Switch>
              {routes.map((route, index) => {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={withTracker((props) => {
                      return (
                        <route.layout {...props}>
                          <route.component {...props} />
                        </route.layout>
                      );
                    })}
                  />
                );
              })}
            </Switch>
            </ScrollToTop>
          </div>
        </Router>
  );
}

export default App;
