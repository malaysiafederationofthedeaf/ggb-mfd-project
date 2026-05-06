import cookies from "js-cookie";
import { Store } from "../../flux";
import apiClient from "./client";

// Utility functions

const getCurrentLocale = () => cookies.get("i18next") || "en";

// API functions
export const getAlphabetsList = () => Store.getAlphabetsList();

// Fetch vocabulary data directly from API
export const fetchVocabData = async () => {
  let allData = [];
  let page = 1;
  let hasMoreData = true;

  while (hasMoreData) {
    try {
      const response = await apiClient.get(
        `/api/bims?populate=category_group&pagination[page]=${page}&pagination[pageSize]=25`
      );

      if (!response.data?.data) {
        console.error("Invalid API response structure:", response);
        break;
      }

      const batchData = response.data.data.map((item) => {
        const categoryGroup = item.category_group || {};
        return {
          kumpulanKategori:
            categoryGroup.KumpulanKategori ||
            `${item.Kumpulan}/${item.Kategori}`,
          groupCategory:
            categoryGroup.GroupCategory || `${item.Group}/${item.Category}`,
          word: item.Word || "",
          perkataan: item.Perkataan || "",
          video: item.Video || "",
          imgStatus: item.Image_Status || "",
          exampleSentence: item.Example_Sentence || "",
        };
      });

      allData = [...allData, ...batchData];
      hasMoreData = page < response.data.meta.pagination.pageCount;
      page++;
    } catch (err) {
      console.error("Error fetching data:", err);
      hasMoreData = false;
    }
  }

  const processedData = allData
    .map((item) => ({
      kumpulanKategori: item.kumpulanKategori
        .toString()
        .replaceAll(/(\r\n|\n|\r)/gm, ""),
      groupCategory: item.groupCategory
        .toString()
        .replaceAll(/(\r\n|\n|\r)/gm, ""),
      word: item.word.toString().trim(),
      perkataan: item.perkataan.toString().trim(),
      video: item.video,
      imgStatus: item.imgStatus,
      exampleSentence: item.exampleSentence || "",
    }))
    .sort((a, b) =>
      getCurrentLocale() === "ms"
        ? a.perkataan.localeCompare(b.perkataan)
        : a.word.localeCompare(b.word)
    );

  return processedData;
};

// Alphabet-specific caching
const CACHE_DURATION = 5 * 60 * 1000;

export const alphabetCache = new Map();
export const alphabetCacheTimestamps = new Map();

export const getVocabsByAlphabet = async (alphabetFirst) => {
  if (!alphabetFirst) return [];

  try {
    const now = Date.now();
    const locale = getCurrentLocale();
    const cacheKey = `${locale}-${alphabetFirst.toLowerCase()}`;

    if (
      alphabetCache.has(cacheKey) &&
      alphabetCacheTimestamps.has(cacheKey) &&
      now - alphabetCacheTimestamps.get(cacheKey) < CACHE_DURATION
    ) {
      return alphabetCache.get(cacheKey);
    }

    const vocabAlpha = await fetchVocabsByAlphabetFromAPI(alphabetFirst);

    alphabetCache.set(cacheKey, vocabAlpha);
    alphabetCacheTimestamps.set(cacheKey, now);

    return vocabAlpha;
  } catch (error) {
    console.error("Error in getVocabsByAlphabet:", error);

    const locale = getCurrentLocale();
    const cacheKey = `${locale}-${alphabetFirst.toLowerCase()}`;

    if (alphabetCache.has(cacheKey)) {
      return alphabetCache.get(cacheKey);
    }

    const storeVocabs = Store.getVocabsItems();
    if (storeVocabs && storeVocabs.length > 0) {
      return getVocabsFromStore(alphabetFirst, storeVocabs);
    }

    return [];
  }
};

export const clearAlphabetCache = (alphabetFirst = null) => {
  if (alphabetFirst) {
    const locale = getCurrentLocale();
    const cacheKey = `${locale}-${alphabetFirst.toLowerCase()}`;
    alphabetCache.delete(cacheKey);
    alphabetCacheTimestamps.delete(cacheKey);
  } else {
    alphabetCache.clear();
    alphabetCacheTimestamps.clear();
  }
};

export const fetchVocabsByAlphabetFromAPI = async (alphabetFirst) => {
  if (!alphabetFirst) return [];

  let allData = [];
  let page = 1;
  let hasMoreData = true;
  const locale = getCurrentLocale();
  const fieldToFilter = locale === "ms" ? "Perkataan" : "Word";
  const uppercaseAlphabet = alphabetFirst.toUpperCase();

  while (hasMoreData) {
    try {
      const response = await apiClient.get(
        `/api/bims?populate=category_group&pagination[page]=${page}&pagination[pageSize]=100&filters[${fieldToFilter}][$startsWith]=${encodeURIComponent(
          uppercaseAlphabet
        )}`
      );

      if (!response.data?.data) {
        console.error("Invalid API response structure:", response);
        break;
      }

      const batchData = response.data.data.map((item) => {
        const categoryGroup = item.category_group || {};
        return {
          kumpulanKategori:
            categoryGroup.KumpulanKategori ||
            `${item.Kumpulan}/${item.Kategori}`,
          groupCategory:
            categoryGroup.GroupCategory || `${item.Group}/${item.Category}`,
          word: item.Word || "",
          perkataan: item.Perkataan || "",
          video: item.Video || "",
          imgStatus: item.Image_Status || "",
          exampleSentence: item.Example_Sentence || "",
        };
      });

      allData = [...allData, ...batchData];
      hasMoreData = page < response.data.meta.pagination.pageCount;
      page++;
    } catch (err) {
      console.error("Error fetching filtered data:", err);
      hasMoreData = false;
    }
  }

  const processedData = allData
    .map((item) => ({
      kumpulanKategori: item.kumpulanKategori
        .toString()
        .replaceAll(/(\r\n|\n|\r)/gm, ""),
      groupCategory: item.groupCategory
        .toString()
        .replaceAll(/(\r\n|\n|\r)/gm, ""),
      word: item.word.toString().trim(),
      perkataan: item.perkataan.toString().trim(),
      video: item.video,
      imgStatus: item.imgStatus,
      exampleSentence: item.exampleSentence || "",
    }))
    // Removed release filtering
    .sort((a, b) =>
      locale === "ms"
        ? a.perkataan.localeCompare(b.perkataan)
        : a.word.localeCompare(b.word)
    );

  return processedData;
};

let newSignsPromise = null;

// Get new signs - fixed implementation with proper caching
export const getNewSigns = async () => {
  const cacheKey = "new-signs";
  const now = Date.now();

  try {
    // Check if we have cached data for new signs
    if (
      alphabetCache.has(cacheKey) &&
      alphabetCacheTimestamps.has(cacheKey) &&
      now - alphabetCacheTimestamps.get(cacheKey) < CACHE_DURATION
    ) {
      return alphabetCache.get(cacheKey);
    }

    if (newSignsPromise) {
      return newSignsPromise;
    }

    newSignsPromise = (async () => {
      const locale = getCurrentLocale();

    const processedData = response.data.data.map((item) => {
      const categoryGroup = item.category_group || {};
      return {
        kumpulanKategori:
          categoryGroup.KumpulanKategori || `${item.Kumpulan}/${item.Kategori}`,
        groupCategory:
          categoryGroup.GroupCategory || `${item.Group}/${item.Category}`,
        word: item.Word || "",
        perkataan: item.Perkataan || "",
        video: item.Video || "",
        imgStatus: item.Image_Status || "",
      };
    })
      .map((item) => ({
        kumpulanKategori: item.kumpulanKategori
          .toString()
          .replaceAll(/(\r\n|\n|\r)/gm, ""),
        groupCategory: item.groupCategory
          .toString()
          .replaceAll(/(\r\n|\n|\r)/gm, ""),
        word: item.word.toString().trim(),
        perkataan: item.perkataan.toString().trim(),
        video: item.video,
        imgStatus: item.imgStatus,
      }))
      // Additional client-side sorting to ensure correct alphabetical order
      .sort((a, b) =>
        locale === "ms"
          ? a.perkataan.localeCompare(b.perkataan)
          : a.word.localeCompare(b.word)
      );

      const transformedData = response.data.data.map((item) => {
        const categoryGroup = item.category_group || {};
        return {
          kumpulanKategori:
            categoryGroup.KumpulanKategori ||
            `${item.Kumpulan}/${item.Kategori}`,
          groupCategory:
            categoryGroup.GroupCategory || `${item.Group}/${item.Category}`,
          word: item.Word || "",
          perkataan: item.Perkataan || "",
          video: item.Video || "",
          tag: item.Tag || "",
          new: item.New || "No",
          order: item.Order || "",
          imgStatus: item.Image_Status || "",
          exampleSentence: item.Example_Sentence || "",
        };
      });

      const processedData = transformedData
        .map((item) => ({
          kumpulanKategori: item.kumpulanKategori
            .toString()
            .replaceAll(/(\r\n|\n|\r)/gm, ""),
          groupCategory: item.groupCategory
            .toString()
            .replaceAll(/(\r\n|\n|\r)/gm, ""),
          word: item.word.toString().trim(),
          perkataan: item.perkataan.toString().trim(),
          video: item.video,
          tag: item.tag,
          new: item.new,
          order: item.order,
          imgStatus: item.imgStatus,
          exampleSentence: item.exampleSentence || "",
        }))
        // Additional client-side sorting to ensure correct alphabetical order
        .sort((a, b) =>
          locale === "ms"
            ? a.perkataan.localeCompare(b.perkataan)
            : a.word.localeCompare(b.word)
        );

      // Store in cache
      alphabetCache.set(cacheKey, processedData);
      alphabetCacheTimestamps.set(cacheKey, Date.now());

      return processedData;
    })();

    const result = await newSignsPromise;
    return result;
  } catch (error) {
    console.error("Error in getNewSigns:", error);

    // Check if we have cached data even if it's expired
    if (alphabetCache.has(cacheKey)) {
      return alphabetCache.get(cacheKey);
    }

    return [];
  } finally {
    newSignsPromise = null;
  }
};

const getVocabsFromStore = (alphabetFirst, vocabsItems) => {
  const locale = getCurrentLocale();

  return vocabsItems
    .filter((vocAl) =>
      locale === "ms"
        ? (vocAl.perkataan || vocAl.Perkataan)
            ?.toLowerCase()
            .startsWith(alphabetFirst.toLowerCase())
        : (vocAl.word || vocAl.Word)
            ?.toLowerCase()
            .startsWith(alphabetFirst.toLowerCase())
    )
    .sort((a, b) =>
      locale === "ms"
        ? (a.perkataan || a.Perkataan).localeCompare(b.perkataan || b.Perkataan)
        : (a.word || a.Word).localeCompare(b.word || b.Word)
    );
};