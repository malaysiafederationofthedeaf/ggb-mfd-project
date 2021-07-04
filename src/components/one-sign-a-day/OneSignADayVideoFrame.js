import React from "react";
import ReactPlayer from 'react-player';
import PageTitle from "../common/PageTitle";

const OneSignADayVideoframe = ({ video }) => {
    return (
<section id={video.id}>
    <PageTitle title={video.title} className="facebook-video-page-title" />
        <div className="facebook-video-wrapper">
            <ReactPlayer 
                url={video.url} 
                playing={window.location.hash === ("#" + video.id)} 
                controls={true} 
                loop={true}
                width="100%"
            />
        </div>
    </section>
    );
};

export default OneSignADayVideoframe;

