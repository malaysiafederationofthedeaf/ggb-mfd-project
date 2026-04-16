const useBff = process.env.REACT_APP_USE_VERCEL_BFF === "true";
const BFF_BASE_URL = process.env.REACT_APP_BFF_BASE_URL;
const STRAPI_BASE_URL = "https://bimsignbank-strapi-testing2.onrender.com";

export const API_BASE = useBff && BFF_BASE_URL ? BFF_BASE_URL : STRAPI_BASE_URL;
