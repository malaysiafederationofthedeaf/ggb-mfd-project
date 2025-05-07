import axios from "axios";
import { Store } from "../../flux";

// Cache mechanism
const categoryCache = new Map();
const categoryCacheTimestamps = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Export the cache for use in other services if needed
export { categoryCache, categoryCacheTimestamps };

// Utility functions
const formatString = (str) => {
  return Store.formatString(str);
};

// Get categories of a group
export const getCategoriesOfGroup = (group) => {
  if (!group) {
    console.warn("No group provided to getCategoriesOfGroup");
    return [];
  }

  if (formatString(group) === formatString("New Signs")) {
    return Store.getNewSigns();
  }

  return Store.getCategoriesOfGroup(group);
};

// Fetch vocabs by category from API
export const fetchVocabsByCategoryFromAPI = async (group, category) => {
  if (!group || !category) return [];
  
  try {
    // Capitalize first letter of group and category
    const capitalizedGroup = group.charAt(0).toUpperCase() + group.slice(1);
    const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    const groupCategoryPair = `${capitalizedGroup}/${capitalizedCategory}`;
    
    console.log(`Fetching vocabs for group/category: ${groupCategoryPair}`);
    
    // Construct the API query with the correct relation filter
    const response = await axios.get(
      `https://mfd-final-test.onrender.com/api/bims?populate=*&filters[category_group][GroupCategory][$eq]=${groupCategoryPair}`
    );
    
    if (!response.data || !response.data.data) {
      console.error('Invalid API response structure:', response);
      return [];
    }
    
    // Transform and filter the data
    const transformedData = response.data.data
      .map(item => ({
        kumpulanKategori: item.category_group?.KumpulanKategori || `${item.Kumpulan}/${item.Kategori}`,
        groupCategory: item.category_group?.GroupCategory || `${item.Group}/${item.Category}`,
        word: item.Word || '',
        perkataan: item.Perkataan || '',
        video: item.Video || '',
        tag: item.Tag || '',
        release: item.Release || '',
        new: item.New || 'No',
        sotd: item.SOTD || '',
        order: item.Order || '',
        imgStatus: item.Image_Status || ''
      }))
      .filter(item => 
        ["Release 1", "Release 2", "Release 3"].includes(item.release)
      )
      .sort((a, b) => {
        // If both have order, sort by order
        if (a.order !== null && b.order !== null) {
          return a.order - b.order;
        }
        // If only one has order, put the one with order first
        if (a.order !== null) return -1;
        if (b.order !== null) return 1;
        // Otherwise sort alphabetically
        return a.perkataan.localeCompare(b.perkataan);
      });
    
    return transformedData;
  } catch (error) {
    console.error("Error fetching vocabs by category:", error);
    return [];
  }
};

// Fetch new signs from API
export const fetchNewSignsFromAPI = async () => {
  try {
    console.log("Fetching new signs");
    
    // Construct the API query
    const response = await axios.get(
      `https://mfd-final-test.onrender.com/api/bims?populate=*&filters[New][$eq]=Yes`
    );
    
    if (!response.data || !response.data.data) {
      console.error('Invalid API response structure:', response);
      return [];
    }
    
    // Transform and filter the data
    const transformedData = response.data.data
      .map(item => ({
        kumpulanKategori: item.category_group?.KumpulanKategori || `${item.Kumpulan}/${item.Kategori}`,
        groupCategory: item.category_group?.GroupCategory || `${item.Group}/${item.Category}`,
        word: item.Word || '',
        perkataan: item.Perkataan || '',
        video: item.Video || '',
        tag: item.Tag || '',
        release: item.Release || '',
        new: item.New || 'No',
        sotd: item.SOTD || '',
        order: item.Order || '',
        imgStatus: item.Image_Status || ''
      }))
      .filter(item => 
        ["Release 1", "Release 2", "Release 3"].includes(item.release) &&
        item.new === "Yes"
      );
    
    return transformedData;
  } catch (error) {
    console.error("Error fetching new signs:", error);
    return [];
  }
};

// Get vocabs by category with caching
export const getVocabsByCategory = async (group, category) => {
  if (!group) return [];
  
  // Handle new signs category
  if (formatString(group) === formatString("new-signs")) {
    return getNewSigns();
  }
  
  if (!category) return [];
  
  try {
    const cacheKey = `${formatString(group)}/${formatString(category)}`;
    const now = Date.now();
    
    // Check if we have cached data for this category
    if (categoryCache.has(cacheKey) && 
        categoryCacheTimestamps.has(cacheKey) && 
        (now - categoryCacheTimestamps.get(cacheKey) < CACHE_DURATION)) {
      console.log(`Using cached data for category: ${cacheKey}`);
      return categoryCache.get(cacheKey);
    }
    
    // If not in cache, fetch from API
    console.log(`Cache miss for category: ${cacheKey}, fetching from API`);
    const vocabsCategory = await fetchVocabsByCategoryFromAPI(group, category);
    
    // Store in category-specific cache
    categoryCache.set(cacheKey, vocabsCategory);
    categoryCacheTimestamps.set(cacheKey, now);
    
    return vocabsCategory;
  } catch (error) {
    console.error("Error in getVocabsByCategory:", error);
    
    // Check if we have cached data for this category even if it's expired
    const cacheKey = `${formatString(group)}/${formatString(category)}`;
    if (categoryCache.has(cacheKey)) {
      console.log(`Using expired cache for category: ${cacheKey} due to error`);
      return categoryCache.get(cacheKey);
    }
    
    // Fallback to Store if API call fails and no cache exists
    console.log("Falling back to Store data for category vocabs");
    return Store.getVocabList(group, formatString(category));
  }
};

// Get new signs with caching
export const getNewSigns = async () => {
  try {
    const cacheKey = "new-signs";
    const now = Date.now();
    
    // Check if we have cached data for new signs
    if (categoryCache.has(cacheKey) && 
        categoryCacheTimestamps.has(cacheKey) && 
        (now - categoryCacheTimestamps.get(cacheKey) < CACHE_DURATION)) {
      console.log(`Using cached data for new signs`);
      return categoryCache.get(cacheKey);
    }
    
    // If not in cache, fetch from API
    console.log(`Cache miss for new signs, fetching from API`);
    const newSigns = await fetchNewSignsFromAPI();
    
    // Store in cache
    categoryCache.set(cacheKey, newSigns);
    categoryCacheTimestamps.set(cacheKey, now);
    
    return newSigns;
  } catch (error) {
    console.error("Error in getNewSigns:", error);
    
    // Check if we have cached data for new signs even if it's expired
    if (categoryCache.has("new-signs")) {
      console.log(`Using expired cache for new signs due to error`);
      return categoryCache.get("new-signs");
    }
    
    // Fallback to Store if API call fails and no cache exists
    console.log("Falling back to Store data for new signs");
    return Store.getNewSigns();
  }
};

// Clear category cache
export const clearCategoryCache = (group = null, category = null) => {
  if (group && category) {
    // Clear specific category cache
    const cacheKey = `${formatString(group)}/${formatString(category)}`;
    categoryCache.delete(cacheKey);
    categoryCacheTimestamps.delete(cacheKey);
    console.log(`Cache cleared for category: ${cacheKey}`);
  } else if (group === "new-signs") {
    // Clear new signs cache
    categoryCache.delete("new-signs");
    categoryCacheTimestamps.delete("new-signs");
    console.log("New signs cache cleared");
  } else {
    // Clear all category caches
    categoryCache.clear();
    categoryCacheTimestamps.clear();
    console.log("All category caches cleared");
  }
};