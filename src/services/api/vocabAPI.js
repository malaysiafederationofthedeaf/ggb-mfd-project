import axios from "axios";
import { Store } from "../../flux";
import { alphabetCache, alphabetCacheTimestamps } from "./alphabetAPI";

// Utility functions
const formatString = (str) => {
  return Store.formatString(str);
};

// Helper function to capitalize first letter
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Cache mechanism
const vocabCache = new Map();
const vocabCacheTimestamps = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Find vocab in alphabet data
const findVocabInAlphabetData = (vocabName) => {
  if (!vocabName) return null;
  
  const formattedVocabName = formatString(vocabName);
  const firstLetter = formattedVocabName.charAt(0);
  
  // Check if we have alphabet data cached
  if (alphabetCache && alphabetCache.has(firstLetter)) {
    console.log(`Looking for vocab "${vocabName}" in cached alphabet data for "${firstLetter}"`);
    
    const alphabetData = alphabetCache.get(firstLetter);
    const matchingVocabs = alphabetData.filter(item => 
      !formatString(item.word).localeCompare(formattedVocabName)
    );
    
    if (matchingVocabs.length > 0) {
      console.log(`Found vocab "${vocabName}" in alphabet cache`);
      return matchingVocabs;
    }
  }
  
  return null;
};

// Fetch vocab detail from API
export const fetchVocabDetailFromAPI = async (vocabName) => {
  if (!vocabName) return null;
  
  try {
    // First check if we can find the vocab in alphabet data
    const vocabFromAlphabet = findVocabInAlphabetData(vocabName);
    if (vocabFromAlphabet) {
      return vocabFromAlphabet;
    }
    
    // Format the vocab name for comparison
    const formattedVocabName = formatString(vocabName);
    
    // Capitalize the first letter for the API request
    const capitalizedVocabName = capitalizeFirstLetter(vocabName);
    console.log(`Searching for vocab with capitalized name: ${capitalizedVocabName}`);
    
    // Fetch data from API with capitalized first letter
    const response = await axios.get(
      `https://mfd-final-test.onrender.com/api/bims?populate=*&filters[Word][$containsi]=${capitalizedVocabName}`
    );
    
    if (!response.data || !response.data.data) {
      console.error('Invalid API response structure:', response);
      return null;
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
        !formatString(item.word).localeCompare(formattedVocabName)
      );
    
    return transformedData.length > 0 ? transformedData : null;
  } catch (error) {
    console.error("Error fetching vocab detail:", error);
    return null;
  }
};

// Get vocab detail with caching
export const getVocabDetail = async (vocabName) => {
  if (!vocabName) return null;
  
  try {
    const now = Date.now();
    
    // Check if we have cached data for this vocab
    if (vocabCache.has(vocabName) && 
        vocabCacheTimestamps.has(vocabName) && 
        (now - vocabCacheTimestamps.get(vocabName) < CACHE_DURATION)) {
      console.log(`Using cached data for vocab: ${vocabName}`);
      return vocabCache.get(vocabName);
    }
    
    // Check if we can find it in alphabet data first
    const vocabFromAlphabet = findVocabInAlphabetData(vocabName);
    if (vocabFromAlphabet) {
      // Store in vocab-specific cache
      vocabCache.set(vocabName, vocabFromAlphabet);
      vocabCacheTimestamps.set(vocabName, now);
      return vocabFromAlphabet;
    }
    
    // If not in cache or alphabet data, fetch from API
    console.log(`Cache miss for vocab: ${vocabName}, fetching from API`);
    const vocabDetail = await fetchVocabDetailFromAPI(vocabName);
    
    // Store in vocab-specific cache
    if (vocabDetail) {
      vocabCache.set(vocabName, vocabDetail);
      vocabCacheTimestamps.set(vocabName, now);
    }
    
    return vocabDetail;
  } catch (error) {
    console.error("Error in getVocabDetail:", error);
    
    // Check if we have cached data for this vocab even if it's expired
    if (vocabCache.has(vocabName)) {
      console.log(`Using expired cache for vocab: ${vocabName} due to error`);
      return vocabCache.get(vocabName);
    }
    
    // Fallback to Store if API call fails and no cache exists
    console.log("Falling back to Store data for vocab detail");
    return Store.getVocabDetail(vocabName);
  }
};

// Clear vocab cache
export const clearVocabCache = (vocabName = null) => {
  if (vocabName) {
    // Clear specific vocab cache
    vocabCache.delete(vocabName);
    vocabCacheTimestamps.delete(vocabName);
    console.log(`Cache cleared for vocab: ${vocabName}`);
  } else {
    // Clear all vocab caches
    vocabCache.clear();
    vocabCacheTimestamps.clear();
    console.log("All vocab caches cleared");
  }
};