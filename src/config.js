export const STRAPI_BASE_URL = process.env.REACT_APP_STRAPI_BASE_URL;

export const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export const FEATURED_VIDEOS_PLAYLIST_ID = process.env.REACT_APP_FEATURED_VIDEOS_PLAYLIST_ID;

export const IMAGE_BASE_URL = process.env.REACT_APP_R2_BASE_URL 
  ? (process.env.REACT_APP_R2_BASE_URL.endsWith('/') 
      ? process.env.REACT_APP_R2_BASE_URL 
      : `${process.env.REACT_APP_R2_BASE_URL}/`)
  : '';

export const GA_TRACKING_ID = process.env.REACT_APP_GAID;

export const COMING_SOON_IMAGE_URL = process.env.REACT_APP_COMING_SOON_IMAGE_URL;

export const YOUTUBE_BASE_URL = process.env.REACT_APP_YOUTUBE_BASE_URL;