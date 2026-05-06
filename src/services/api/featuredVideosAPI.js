import { Store } from "../../flux";
import axios from "axios";

// Proxy endpoint served by the Cloudflare Pages Function at functions/api/youtube-playlist.js
// This avoids direct browser→googleapis calls which are blocked by CORS.
const YOUTUBE_PROXY_URL = "/api/youtube-playlist";

// Cache mechanism
const videosCache = new Map();
let cacheTimestamp = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Fetch featured videos via the server-side proxy (resolves CORS & hides API key)
export const fetchFeaturedVideosFromAPI = async () => {
  try {
    const response = await axios.get(YOUTUBE_PROXY_URL, { timeout: 15000 });
    
    if (!response.data || !response.data.items) {
      console.error('Invalid API response structure:', response);
      return [];
    }
    
    // Transform the data
    const transformedData = response.data.items.map(item => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || "",
      publishedAt: item.snippet.publishedAt
    }));
    
    return transformedData;
  } catch (error) {
    console.error("Error fetching featured videos:", error);
    return [];
  }
};

// Get featured videos with caching
export const getFeaturedVideos = async () => {
  try {
    const now = Date.now();
    
    // Check if we have cached data
    if (cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION) && videosCache.size > 0) {

      return Array.from(videosCache.values());
    }
    
    // If not in cache, first check Store
    const storeVideos = Store.getFeaturedVideosList();
    if (storeVideos && storeVideos.length > 0) {

      
      // Update cache
      videosCache.clear();
      storeVideos.forEach(video => {
        videosCache.set(video.id, video);
      });
      cacheTimestamp = now;
      
      return storeVideos;
    }
    
    // If not in Store, fetch from API

    const videos = await fetchFeaturedVideosFromAPI();
    
    // Store in cache
    if (videos && videos.length > 0) {
      videosCache.clear();
      videos.forEach(video => {
        videosCache.set(video.id, video);
      });
      cacheTimestamp = now;
    }
    
    return videos;
  } catch (error) {
    console.error("Error in getFeaturedVideos:", error);
    
    // Fallback to Store if API call fails and no cache exists

    return Store.getFeaturedVideosList();
  }
};

// Clear videos cache
export const clearVideosCache = () => {
  videosCache.clear();
  cacheTimestamp = null;

};

// Get video URL
export const getVideoUrl = (videoId) => {
  return Store.getFeaturedVideoUrl(videoId);
};