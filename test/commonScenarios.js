// ==========================
// COMMON HEADERS
// ==========================
require('dotenv').config({ path: '.env.local' });

const baseHeaders = {
  Accept: "application/json",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "X-Internal-Token": process.env.INTERNAL_TOKEN
};

module.exports = [
  // 1. Home
  {
    name: "Home - Browse Bims",
    flow: [
      { function: "pickHomeUrl" },
      { get: { url: "{{ url }}", headers: baseHeaders } }
    ]
  },

  // 2. Category Groups
  {
    name: "Browse Category Groups",
    flow: [
      { function: "pickCategoryGroupUrl" },
      { get: { url: "{{ url }}", headers: baseHeaders } }
    ]
  },

  // 3. New Signs
  {
    name: "View New Signs",
    flow: [
      { function: "pickNewSignsUrl" },
      { get: { url: "{{ url }}", headers: baseHeaders } }
    ]
  },

  // 4. Search
  {
    name: "Search for Word",
    flow: [
      { function: "pickSearchUrl" },
      { get: { url: "{{ url }}", headers: baseHeaders } }
    ]
  },

  // 5. Alphabet
  {
    name: "Browse Alphabet",
    flow: [
      { function: "pickAlphabetUrl" },
      { get: { url: "{{ url }}", headers: baseHeaders } }
    ]
  },

  // 6. Category Detail
  {
    name: "Category Detail",
    flow: [
      { function: "pickCategoryDetailUrl" },
      { get: { url: "{{ url }}", headers: baseHeaders } }
    ]
  },

  // 7. Latest
  {
    name: "Latest Signs",
    flow: [
      { function: "pickLatestUrl" },
      { get: { url: "{{ url }}", headers: baseHeaders } }
    ]
  }
];
