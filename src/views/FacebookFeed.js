import React from "react";

const FacebookFeed = () => {
  return (
    <iframe 
      title="facebook-iframe"
      className="col-sm-12 col-md-6 col-lg-6 col-xl-4 mfd-fb-iframe"
      id="fb-iframe"
      src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FBahasaIsyaratMalaysiaMFD&tabs=timeline&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false&appId"
      scrolling="no"
      frameBorder="0"
      allowFullScreen="true" 
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
  );
};

export default FacebookFeed;
