import React, { useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import routes from "./routes";
import withTracker from "./withTracker";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/App.scss";
import Aos from "aos";
import "aos/dist/aos.css";
import ScrollToTop from "./components/common/ScrollToTop";
import LoadingIndicator from "./components/common/LoadingIndicator";

function App() {
  useEffect(() => {
    Aos.init();
  }, []);
  return (
    <Router>
      <ScrollToTop>
        <Suspense fallback={<LoadingIndicator />}>
          <Routes>
            {routes.map((route, index) => {
              const Layout = route.layout || React.Fragment;
              const Component = route.component;
              const TrackedComponent = withTracker(Component);
              return (
                <Route
                  key={route.path || index}
                  path={route.path}
                  element={
                    <Layout>
                      <TrackedComponent />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </Suspense>
      </ScrollToTop>
    </Router>
  );
}

export default App;