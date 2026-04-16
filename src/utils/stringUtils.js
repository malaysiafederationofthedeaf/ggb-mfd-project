/**
 * Function to trim words for display.
 * Trims words longer than 45 characters and removes content in parentheses.
 * 
 * @param {string} word - The word to trim
 * @returns {string} The trimmed word
 */
export const trimWord = (word) => {
  if (!word) return '';
  
  const length = word.length;
  if (length >= 45) {
    if (word.includes('(') && word.includes(')')) {
      // Find the index of '(' and remove it and everything after it.
      // Use trim to remove any trailing spaces before the parenthesis.
      word = word.substring(0, word.indexOf('(')).trim();
    }
  }
  return word;
};
