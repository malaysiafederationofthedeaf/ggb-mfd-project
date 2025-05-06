import axios from "axios";
import cookies from "js-cookie";
import { Store } from "../../flux";

// Utility functions
const formatString = (str) => {
  return Store.formatString(str);
};

const getCurrentLocale = () => {
  return cookies.get("i18next") || "en";
};

// API functions
export const getAlphabetsList = () => {
  return Store.getAlphabetsList();
};

// Fetch vocabulary data directly from API
const fetchVocabData = async () => {
  let allData = [];
  let page = 1;
  let hasMoreData = true;

  while (hasMoreData) {
    try {
      const response = await axios.get(`https://mfd-final-test.onrender.com/api/bims?populate=*&pagination[page]=${page}&pagination[pageSize]=25`);
      
      if (!response.data || !response.data.data) {
        console.error('Invalid API response structure:', response);
        break;
      }

      const transformedData = response.data.data.map(item => {
        const categoryGroup = item.category_group || {};
        
        return {
          kumpulanKategori: categoryGroup.KumpulanKategori || `${item.Kumpulan}/${item.Kategori}`,
          groupCategory: categoryGroup.GroupCategory || `${item.Group}/${item.Category}`,
          word: item.Word || '',
          perkataan: item.Perkataan || '',
          video: item.Video || '',
          tag: item.Tag || '',
          release: item.Release || '',
          new: item.New || 'No',
          sotd: item.SOTD || '',
          order: item.Order || '',
          imgStatus: item.Image_Status || ''
        };
      });

      allData = [...allData, ...transformedData];
      hasMoreData = page < response.data.meta.pagination.pageCount;
      page++;
    } catch (err) {
      console.error("Error fetching data:", err);
      hasMoreData = false;
    }
  }

  // Process data similar to restructureJSON and filterExcelData in readExcel.js
  const processedData = allData
    .map(item => {
      return {
        kumpulanKategori: item.kumpulanKategori.toString().replaceAll(/(\r\n|\n|\r)/gm, ''),    
        groupCategory: item.groupCategory.toString().replaceAll(/(\r\n|\n|\r)/gm, ''),    
        word: item.word.toString().trim(),
        perkataan: item.perkataan.toString().trim(),
        video: item.video,
        tag: item.tag,
        release: item.release,
        new: item.new,
        order: item.order,
        sotd: item.sotd,
        imgStatus: item.imgStatus
      };
    })
    .filter(item => item !== false)
    .filter(item => ["Release 1", "Release 2", "Release 3"].includes(item.release))
    .sort((a, b) => (a.kumpulanKategori).localeCompare(b.kumpulanKategori));

  return processedData;
};

// Cache mechanism to avoid repeated API calls
let cachedVocabs = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Add alphabet-specific caching
const alphabetCache = new Map();
const alphabetCacheTimestamps = new Map();

// Update the getVocabsByAlphabet function to use enhanced caching
export const getVocabsByAlphabet = async (alphabetFirst) => {
  if (!alphabetFirst) return [];
  
  try {
    const now = Date.now();
    
    // Check if we have cached data for this specific alphabet
    if (alphabetCache.has(alphabetFirst) && 
        alphabetCacheTimestamps.has(alphabetFirst) && 
        (now - alphabetCacheTimestamps.get(alphabetFirst) < CACHE_DURATION)) {
      console.log(`Using cached data for alphabet: ${alphabetFirst}`);
      return alphabetCache.get(alphabetFirst);
    }
    
    // If not in cache, fetch from API
    console.log(`Cache miss for alphabet: ${alphabetFirst}, fetching from API`);
    const vocabAlpha = await fetchVocabsByAlphabetFromAPI(alphabetFirst);
    
    // Store in alphabet-specific cache
    alphabetCache.set(alphabetFirst, vocabAlpha);
    alphabetCacheTimestamps.set(alphabetFirst, now);
    
    return vocabAlpha;
  } catch (error) {
    console.error("Error in getVocabsByAlphabet:", error);
    
    // Check if we have cached data for this alphabet even if it's expired
    if (alphabetCache.has(alphabetFirst)) {
      console.log(`Using expired cache for alphabet: ${alphabetFirst} due to error`);
      return alphabetCache.get(alphabetFirst);
    }
    
    // Fallback to Store if API call fails and no cache exists
    const storeVocabs = Store.getVocabsItems();
    if (storeVocabs && storeVocabs.length > 0) {
      console.log("Falling back to Store data");
      return getVocabsFromStore(alphabetFirst, storeVocabs);
    }
    
    return [];
  }
};

// Add a function to clear the cache if needed
export const clearAlphabetCache = (alphabetFirst = null) => {
  if (alphabetFirst) {
    // Clear specific alphabet cache
    alphabetCache.delete(alphabetFirst);
    alphabetCacheTimestamps.delete(alphabetFirst);
    console.log(`Cache cleared for alphabet: ${alphabetFirst}`);
  } else {
    // Clear all alphabet caches
    alphabetCache.clear();
    alphabetCacheTimestamps.clear();
    cachedVocabs = null;
    cacheTimestamp = null;
    console.log("All caches cleared");
  }
};

// Add a new function that fetches data with filtering
export const fetchVocabsByAlphabetFromAPI = async (alphabetFirst) => {
  if (!alphabetFirst) return [];
  
  let allData = [];
  let page = 1;
  let hasMoreData = true;
  const locale = getCurrentLocale();
  const fieldToFilter = locale === "ms" ? "Perkataan" : "Word";
  
  // Convert the first letter to uppercase for the API filter
  const uppercaseAlphabet = alphabetFirst.toUpperCase();
  
  console.log(`Fetching data with filter: ${fieldToFilter} starts with ${uppercaseAlphabet}`);
  
  while (hasMoreData) {
    try {
      // Add filtering to the API call using the Strapi filter syntax with uppercase letter
      const response = await axios.get(
        `https://mfd-final-test.onrender.com/api/bims?populate=*&pagination[page]=${page}&pagination[pageSize]=25&filters[${fieldToFilter}][$startsWith]=${uppercaseAlphabet}`
      );
      
      if (!response.data || !response.data.data) {
        console.error('Invalid API response structure:', response);
        break;
      }

      const transformedData = response.data.data.map(item => {
        const categoryGroup = item.category_group || {};
        
        return {
          kumpulanKategori: categoryGroup.KumpulanKategori || `${item.Kumpulan}/${item.Kategori}`,
          groupCategory: categoryGroup.GroupCategory || `${item.Group}/${item.Category}`,
          word: item.Word || '',
          perkataan: item.Perkataan || '',
          video: item.Video || '',
          tag: item.Tag || '',
          release: item.Release || '',
          new: item.New || 'No',
          sotd: item.SOTD || '',
          order: item.Order || '',
          imgStatus: item.Image_Status || ''
        };
      });

      allData = [...allData, ...transformedData];
      hasMoreData = page < response.data.meta.pagination.pageCount;
      page++;
    } catch (err) {
      console.error("Error fetching filtered data:", err);
      hasMoreData = false;
    }
  }

  // Process and sort the data
  const processedData = allData
    .map(item => {
      return {
        kumpulanKategori: item.kumpulanKategori.toString().replaceAll(/(\r\n|\n|\r)/gm, ''),    
        groupCategory: item.groupCategory.toString().replaceAll(/(\r\n|\n|\r)/gm, ''),    
        word: item.word.toString().trim(),
        perkataan: item.perkataan.toString().trim(),
        video: item.video,
        tag: item.tag,
        release: item.release,
        new: item.new,
        order: item.order,
        sotd: item.sotd,
        imgStatus: item.imgStatus
      };
    })
    .filter(item => ["Release 1", "Release 2", "Release 3"].includes(item.release))
    .sort((a, b) => {
      if (locale === "ms") {
        return a.perkataan.localeCompare(b.perkataan);
      } else {
        return a.word.localeCompare(b.word);
      }
    });

  console.log(`API returned ${processedData.length} items for ${uppercaseAlphabet}`);
  return processedData;
};

// Fallback function that uses Store data
const getVocabsFromStore = (alphabetFirst, vocabsItems) => {
  return vocabsItems.filter((vocAl) =>
    getCurrentLocale() === "ms"
      ? (vocAl.perkataan || vocAl.Perkataan) && formatString(vocAl.perkataan || vocAl.Perkataan).startsWith(alphabetFirst)
      : (vocAl.word || vocAl.Word) && formatString(vocAl.word || vocAl.Word).startsWith(alphabetFirst)
  )
  .sort((a, b) => {
    if (getCurrentLocale() === "ms") {
      return (a.perkataan || a.Perkataan).localeCompare(b.perkataan || b.Perkataan);
    } else {
      return (a.word || a.Word).localeCompare(b.word || b.Word);
    }
  });
};