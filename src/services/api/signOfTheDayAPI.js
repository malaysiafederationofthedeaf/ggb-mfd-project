import apiClient from "./client";

function getSeededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function formatDateToSeed(date = new Date()) {
  return parseInt(date.toISOString().split("T")[0].replace(/-/g, ""), 10);
}

async function getTotalEntries(apiUrl) {
  try {
    const res = await apiClient.get(`${apiUrl}?pagination[page]=1&pagination[pageSize]=1`);
    return res.data.meta.pagination.total;
  } catch (error) {
    console.error("Error getting total entries for SOTD:", error);
    return 0; // Return 0 to gracefully handle failure
  }
}

async function fetchPageEntries(apiUrl, pageNum, pageSize) {
  try {
    const res = await apiClient.get(`${apiUrl}?populate=category_group&pagination[page]=${pageNum}&pagination[pageSize]=${pageSize}`);
    return res.data.data || [];
  } catch (error) {
    console.error("Error fetching SOTD page entries:", error);
    return [];
  }
}

export async function getSignOfTheDayLightweight() {
  const apiUrl = `/api/bims`;
  const pageSize = 25;
  const seed = formatDateToSeed();
  const totalEntries = await getTotalEntries(apiUrl);
  const totalPages = totalEntries > 0 ? Math.ceil(totalEntries / pageSize) : 1;

  if (totalEntries === 0) {
    return null; // Graceful return if fetch failed or empty
  }

  // Pick a deterministic page number
  const pageSeed = getSeededRandom(seed);
  const pageNum = Math.floor(pageSeed * totalPages) + 1;

  // Fetch entries for that page
  const entries = await fetchPageEntries(apiUrl, pageNum, pageSize);

    if (entries.length === 0) {
      console.warn("No SOTD entries found on page:", pageNum);
      return null;
  }

  // Pick a deterministic entry from the fetched entries
  const indexSeed = getSeededRandom(seed + 1);
  const index = Math.floor(indexSeed * entries.length);
  const selected = entries[index];

  // Return transformed object
  return {
    word: selected.Word || "",
    perkataan: selected.Perkataan || "",
    video: selected.Video || "",
    category: selected.category_group?.KumpulanKategori || "",
    group: selected.category_group?.GroupCategory || "",
    imgStatus: selected.Image_Status || "",
  };
}
