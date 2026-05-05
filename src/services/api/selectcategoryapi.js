import { Store } from "../../flux";
import apiClient from "./client";
import { getNewSigns } from "./alphabetAPI";

// Cache mechanism
const categoryCache = new Map();
const categoryCacheTimestamps = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
// Removed ALLOWED_RELEASES

export { categoryCache, categoryCacheTimestamps };

// Utility functions
const formatString = (str) => Store.formatString(str);

const extractLeadingNumber = (str) => {
  if (!str) return null;
  const match = str.toString().trim().match(/^\s*(\d+)/);
  return match ? Number(match[1]) : null;
};

const compareTextWithNumericPrefix = (a, b) => {
  const textA = (a || "").toString().trim();
  const textB = (b || "").toString().trim();
  const numA = extractLeadingNumber(textA);
  const numB = extractLeadingNumber(textB);

  if (numA !== null && numB !== null) {
    if (numA !== numB) return numA - numB;
    const restA = textA.replace(/^\s*\d+\s*,?\s*/, "");
    const restB = textB.replace(/^\s*\d+\s*,?\s*/, "");
    return restA.localeCompare(restB);
  }

  if (numA !== null) return -1;
  if (numB !== null) return 1;

  return textA.localeCompare(textB);
};

// Reusable transformer for vocab items
const transformVocabItem = (item) => ({
  kumpulanKategori: item.category_group?.KumpulanKategori || `${item.Kumpulan}/${item.Kategori}`,
  groupCategory: item.category_group?.GroupCategory || `${item.Group}/${item.Category}`,
  word: item.Word || '',
  perkataan: item.Perkataan || '',
  video: item.Video || '',
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
    // First, ensure we're working with properly formatted strings
    // Replace any hyphens with spaces in the input parameters
    const cleanGroup = group.replace(/-/g, ' ');
    const cleanCategory = category.replace(/-/g, ' ');
    
    // Capitalize each word
    const formattedGroup = cleanGroup.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    const formattedCategory = cleanCategory.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    // Replace any instances of "-&-" with " & "
    const finalGroup = formattedGroup.replace(/-&-/g, ' & ');
    const finalCategory = formattedCategory.replace(/-&-/g, ' & ');
    
    const groupCategoryPair = `${finalGroup}/${finalCategory}`;
    


    // Properly encode the URL parameter
    const encodedGroupCategoryPair = encodeURIComponent(groupCategoryPair);
    
    const PAGE_SIZE = 25;
    let page = 1;
    let allData = [];
    let totalItems = 0;

    while (true) {
      const apiUrl = `/api/bims?populate=category_group&filters[category_group][GroupCategory][$eq]=${encodedGroupCategoryPair}&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`;


      const response = await apiClient.get(apiUrl);

      const pageData = response.data?.data ?? [];
      const meta = response.data?.meta?.pagination;

      if (meta && page === 1) {
        totalItems = meta.total;
      }

      allData = allData.concat(pageData);

      if (!meta || allData.length >= totalItems) {
        break;
      }

      page++;
    }

    const transformedData = allData
      .map(transformVocabItem)
      // Removed filter for ALLOWED_RELEASES
      .sort((a, b) => compareTextWithNumericPrefix(a.perkataan, b.perkataan));

    return transformedData;
  } catch (error) {
    console.error("Error fetching vocabs by category:", error);
    return [];
  }
};

// Fetch new signs from API
export const fetchNewSignsFromAPI = async () => {
  try {
    const response = await apiClient.get(
      `/api/bims?populate=category_group&sort=createdAt:desc&pagination[limit]=25`
    );

    if (!response.data?.data) {
      console.error("Invalid API response structure:", response);
      return [];
    }

    return response.data.data.map(transformVocabItem);
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
      return categoryCache.get(cacheKey);
    }


    const vocabs = await fetchVocabsByCategoryFromAPI(group, category);

    categoryCache.set(cacheKey, vocabs);
    categoryCacheTimestamps.set(cacheKey, now);

    return vocabs;
  } catch (error) {
    console.error("Error in getVocabsByCategory:", error);

    if (categoryCache.has(cacheKey)) {
      return categoryCache.get(cacheKey);
    }

    console.log("Falling back to Store data for category vocabs");
    const fallbackVocabs = Store.getVocabList(group, formatString(category)) || [];
    return [...fallbackVocabs].sort((a, b) => compareTextWithNumericPrefix(a.perkataan, b.perkataan));
  }
};


// Clear category cache
export const clearCategoryCache = (group = null, category = null) => {
  if (group && category) {
    const cacheKey = `${formatString(group)}/${formatString(category)}`;
    categoryCache.delete(cacheKey);
    categoryCacheTimestamps.delete(cacheKey);

  } else if (group === "new-signs") {
    categoryCache.delete("new-signs");
    categoryCacheTimestamps.delete("new-signs");

  } else {
    categoryCache.clear();
    categoryCacheTimestamps.clear();

  }
};
