import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import GoogleAnalytics from "react-ga";
import { GA_TRACKING_ID } from "./config";

if (GA_TRACKING_ID) {
  GoogleAnalytics.initialize(GA_TRACKING_ID);
}

const withTracker = (WrappedComponent, options = {}) => {
  const HOC = (props) => {
    const location = useLocation();
    
    useEffect(() => {
      if (process.env.NODE_ENV !== "production" || !GA_TRACKING_ID) {
        return;
      }

      const page = location.pathname + location.search;
      GoogleAnalytics.set({
        page,
        ...options
      });
      GoogleAnalytics.pageview(page);
    }, [location]);

    return <WrappedComponent {...props} />;
  };

  return HOC;
};

export default withTracker;