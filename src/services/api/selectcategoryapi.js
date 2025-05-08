import axios from "axios";
import { Store } from "../../flux";

// Cache mechanism
const categoryCache = new Map();
const categoryCacheTimestamps = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const ALLOWED_RELEASES = new Set(["Release 1", "Release 2", "Release 3"]);

export { categoryCache, categoryCacheTimestamps };

// Utility functions
const formatString = (str) => Store.formatString(str);
const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Reusable transformer for vocab items
const transformVocabItem = (item) => ({
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
});

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
    const groupCategoryPair = `${capitalizeFirst(group)}/${capitalizeFirst(category)}`;
    console.log(`Fetching vocabs for group/category: ${groupCategoryPair}`);

    const response = await axios.get(
      `https://mfd-final-test.onrender.com/api/bims?populate=*&filters[category_group][GroupCategory][$eq]=${groupCategoryPair}`
    );

    if (!response.data?.data) {
      console.error('Invalid API response structure:', response);
      return [];
    }

    const transformedData = response.data.data
      .map(transformVocabItem)
      .filter(item => ALLOWED_RELEASES.has(item.release))
      .sort((a, b) => {
        const aOrder = a.order ?? Infinity;
        const bOrder = b.order ?? Infinity;
        if (aOrder !== bOrder) return aOrder - bOrder;
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

    const response = await axios.get(
      `https://mfd-final-test.onrender.com/api/bims?populate=*&filters[New][$eq]=Yes`
    );

    if (!response.data?.data) {
      console.error('Invalid API response structure:', response);
      return [];
    }

    return response.data.data
      .map(transformVocabItem)
      .filter(item => ALLOWED_RELEASES.has(item.release) && item.new === "Yes");

  } catch (error) {
    console.error("Error fetching new signs:", error);
    return [];
  }
};

// Get vocabs by category with caching
export const getVocabsByCategory = async (group, category) => {
  if (!group || !category) return [];

  if (formatString(group) === formatString("new-signs")) {
    return getNewSigns();
  }

  const cacheKey = `${formatString(group)}/${formatString(category)}`;
  const now = Date.now();

  try {
    if (
      categoryCache.has(cacheKey) &&
      categoryCacheTimestamps.has(cacheKey) &&
      now - categoryCacheTimestamps.get(cacheKey) < CACHE_DURATION
    ) {
      console.log(`Using cached data for category: ${cacheKey}`);
      return categoryCache.get(cacheKey);
    }

    console.log(`Cache miss for category: ${cacheKey}, fetching from API`);
    const vocabs = await fetchVocabsByCategoryFromAPI(group, category);

    categoryCache.set(cacheKey, vocabs);
    categoryCacheTimestamps.set(cacheKey, now);

    return vocabs;
  } catch (error) {
    console.error("Error in getVocabsByCategory:", error);

    if (categoryCache.has(cacheKey)) {
      console.log(`Using expired cache for category: ${cacheKey}`);
      return categoryCache.get(cacheKey);
    }

    console.log("Falling back to Store data for category vocabs");
    return Store.getVocabList(group, formatString(category));
  }
};

// Get new signs with caching
export const getNewSigns = async () => {
  const cacheKey = "new-signs";
  const now = Date.now();

  try {
    if (
      categoryCache.has(cacheKey) &&
      categoryCacheTimestamps.has(cacheKey) &&
      now - categoryCacheTimestamps.get(cacheKey) < CACHE_DURATION
    ) {
      console.log("Using cached data for new signs");
      return categoryCache.get(cacheKey);
    }

    console.log("Cache miss for new signs, fetching from API");
    const newSigns = await fetchNewSignsFromAPI();

    categoryCache.set(cacheKey, newSigns);
    categoryCacheTimestamps.set(cacheKey, now);

    return newSigns;
  } catch (error) {
    console.error("Error in getNewSigns:", error);

    if (categoryCache.has(cacheKey)) {
      console.log("Using expired cache for new signs");
      return categoryCache.get(cacheKey);
    }

    console.log("Falling back to Store data for new signs");
    return Store.getNewSigns();
  }
};

// Clear category cache
export const clearCategoryCache = (group = null, category = null) => {
  if (group && category) {
    const cacheKey = `${formatString(group)}/${formatString(category)}`;
    categoryCache.delete(cacheKey);
    categoryCacheTimestamps.delete(cacheKey);
    console.log(`Cache cleared for category: ${cacheKey}`);
  } else if (group === "new-signs") {
    categoryCache.delete("new-signs");
    categoryCacheTimestamps.delete("new-signs");
    console.log("New signs cache cleared");
  } else {
    categoryCache.clear();
    categoryCacheTimestamps.clear();
    console.log("All category caches cleared");
  }
};
