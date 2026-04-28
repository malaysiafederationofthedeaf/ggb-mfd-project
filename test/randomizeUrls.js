// ==========================
// URL POOLS
// ==========================

const homeBimsUrls = [
  "/api/bims?pagination[page]=1&pagination[pageSize]=25",
  "/api/bims?pagination[page]=2&pagination[pageSize]=25",
  "/api/bims?pagination[page]=3&pagination[pageSize]=25",
];

const categoryGroupUrls = [
  "/api/category-groups?pagination[page]=1&pagination[pageSize]=25",
  "/api/category-groups?pagination[page]=2&pagination[pageSize]=25",
];

const newSignsUrls = [
  "/api/bims?populate=category_group&sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=25",
  "/api/bims?populate=category_group&sort=createdAt:desc&pagination[page]=2&pagination[pageSize]=25",
];

const searchUrls = [
  "/api/bims?filters[Word][$containsi]=air&pagination[page]=1&pagination[pageSize]=25",
  "/api/bims?filters[Word][$containsi]=makan&pagination[page]=1&pagination[pageSize]=25",
  "/api/bims?filters[Word][$containsi]=minum&pagination[page]=1&pagination[pageSize]=25",
];

const alphabetUrls = [
  "/api/bims?filters[Word][$startsWith]=A&pagination[page]=1&pagination[pageSize]=25",
  "/api/bims?filters[Word][$startsWith]=B&pagination[page]=1&pagination[pageSize]=25",
  "/api/bims?filters[Word][$startsWith]=C&pagination[page]=1&pagination[pageSize]=25",
];

const categoryDetailUrls = [
  "/api/bims?filters[category_group][GroupCategory][$eq]=Kata%20Kerja%2FMakan&pagination[page]=1&pagination[pageSize]=25",
  "/api/bims?filters[category_group][GroupCategory][$eq]=Kata%20Nama&pagination[page]=1&pagination[pageSize]=25",
];

const latestUrls = [
  "/api/bims?sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=25",
  "/api/bims?sort=createdAt:desc&pagination[page]=2&pagination[pageSize]=25",
];

// ==========================
// HELPER FUNCTIONS
// ==========================

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Optional: dynamic page generator
function randomPage(max = 10) {
  return Math.floor(Math.random() * max) + 1;
}

// ==========================
// PROCESSORS (URL PICKERS)
// ==========================

function pickHomeUrl(context, events, done) {
  const useStatic = Math.random() < 0.7;

  if (useStatic) {
    context.vars.url = pickRandom(homeBimsUrls);
  } else {
    const page = randomPage(20);
    context.vars.url = `/api/bims?pagination[page]=${page}&pagination[pageSize]=25`;
  }

  return done();
}

function pickCategoryGroupUrl(context, events, done) {
  context.vars.url = pickRandom(categoryGroupUrls);
  return done();
}

function pickNewSignsUrl(context, events, done) {
  context.vars.url = pickRandom(newSignsUrls);
  return done();
}

function pickSearchUrl(context, events, done) {
  context.vars.url = pickRandom(searchUrls);
  return done();
}

function pickAlphabetUrl(context, events, done) {
  context.vars.url = pickRandom(alphabetUrls);
  return done();
}

function pickCategoryDetailUrl(context, events, done) {
  context.vars.url = pickRandom(categoryDetailUrls);
  return done();
}

function pickLatestUrl(context, events, done) {
  context.vars.url = pickRandom(latestUrls);
  return done();
}

module.exports = {
  pickHomeUrl,
  pickCategoryGroupUrl,
  pickNewSignsUrl,
  pickSearchUrl,
  pickAlphabetUrl,
  pickCategoryDetailUrl,
  pickLatestUrl
};
