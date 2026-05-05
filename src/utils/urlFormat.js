export const convertToUrlFormat = (str) => {
  if (!str) return '';
  return str
    .trim()
    .replace(/\s*&\s*/g, '-and-')
    .replace(/&/g, '-and-')
    .replace(/\//g, '--')
    .replace(/\s+/g, '-');
};

export const convertFromUrlFormat = (urlString) => {
  if (!urlString) return '';
  return decodeURIComponent(urlString)
    .replace(/-and-/g, ' & ')
    .replace(/-amp-/g, ' & ')
    .replace(/--/g, '/')
    .replace(/-/g, ' ');
};
