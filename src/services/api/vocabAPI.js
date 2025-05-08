import axios from "axios";
import { Store } from "../../flux";
import { alphabetCache, alphabetCacheTimestamps } from "./alphabetAPI";

// Utility: Format string using Store method
const formatString = (str) => Store.formatString(str);

// Utility: Capitalize the first letter
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Cache setup
const vocabCache = new Map();
const vocabCacheTimestamps = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Find vocab in alphabet cache
const findVocabInAlphabetData = (vocabName) => {
  if (!vocabName) return null;

  const formatted = formatString(vocabName);
  const firstLetter = formatted.charAt(0);

  if (alphabetCache?.has(firstLetter)) {
    console.log(`Looking for "${vocabName}" in alphabet cache [${firstLetter}]`);

    const entries = alphabetCache.get(firstLetter);
    const matches = entries.filter(
      (item) => !formatString(item.word).localeCompare(formatted)
    );

    if (matches.length > 0) {
      console.log(`Found "${vocabName}" in alphabet cache`);
      return matches;
    }
  }

  return null;
};

// Fetch vocab from external API
export const fetchVocabDetailFromAPI = async (vocabName) => {
  if (!vocabName) return null;

  const formatted = formatString(vocabName);
  const capitalized = capitalizeFirstLetter(vocabName);
  const endpoint = `https://mfd-final-test.onrender.com/api/bims?populate=*&filters[Word][$containsi]=${capitalized}`;

  try {
    const cachedData = findVocabInAlphabetData(vocabName);
    if (cachedData) return cachedData;

    console.log(`Fetching "${vocabName}" from API`);
    const response = await axios.get(endpoint);

    const data = response.data?.data || [];
    const filtered = data
      .map((item) => ({
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
      .filter(
        (entry) =>
          ["Release 1", "Release 2", "Release 3"].includes(entry.release) &&
          !formatString(entry.word).localeCompare(formatted)
      );

    return filtered.length > 0 ? filtered : null;
  } catch (error) {
    console.error("API error while fetching vocab:", error);
    return null;
  }
};

// Get vocab with caching
export const getVocabDetail = async (vocabName) => {
  if (!vocabName) return null;

  const now = Date.now();

  try {
    // Return cached if valid
    if (
      vocabCache.has(vocabName) &&
      vocabCacheTimestamps.has(vocabName) &&
      now - vocabCacheTimestamps.get(vocabName) < CACHE_DURATION
    ) {
      console.log(`Using cached vocab: "${vocabName}"`);
      return vocabCache.get(vocabName);
    }

    // Check alphabet cache
    const alphabetData = findVocabInAlphabetData(vocabName);
    if (alphabetData) {
      vocabCache.set(vocabName, alphabetData);
      vocabCacheTimestamps.set(vocabName, now);
      return alphabetData;
    }

    // Fetch from API
    console.log(`Cache miss for "${vocabName}", querying API...`);
    const fetched = await fetchVocabDetailFromAPI(vocabName);

    if (fetched) {
      vocabCache.set(vocabName, fetched);
      vocabCacheTimestamps.set(vocabName, now);
    }

    return fetched;
  } catch (err) {
    console.error(`Failed to get vocab: "${vocabName}"`, err);

    // Fallback to stale cache if available
    if (vocabCache.has(vocabName)) {
      console.log(`Using stale cache for "${vocabName}"`);
      return vocabCache.get(vocabName);
    }

    // Last-resort fallback to Store
    console.log(`Falling back to Store for "${vocabName}"`);
    return Store.getVocabDetail(vocabName);
  }
};

// Clear vocab cache
export const clearVocabCache = (vocabName = null) => {
  if (vocabName) {
    vocabCache.delete(vocabName);
    vocabCacheTimestamps.delete(vocabName);
    console.log(`Cleared cache for: "${vocabName}"`);
  } else {
    vocabCache.clear();
    vocabCacheTimestamps.clear();
    console.log("Cleared all vocab caches");
  }
};
