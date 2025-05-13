import { fetchVocabData } from "./alphabetAPI";

let signOfTheDay = null;

// get word of the day 'randomly' for each day based on date
export const getSignOfTheDay = async () => {
  // If we have a stored sign of the day, return it
  if (signOfTheDay) {
    return signOfTheDay;
  }

  // Otherwise check if there's one for today's date
  const sotd = await checkSignOfTheDay();
  if (sotd) {
    signOfTheDay = sotd;
    return signOfTheDay;
  } else {
    // If no sign of the day is set, generate one based on the date
    const time = new Date().getTime();
    const days = Math.floor(time / 86400000); // Convert ms to days
    const vocabsItems = await fetchVocabData();
    const sortedVocabs = vocabsItems.sort((a, b) => a.word.localeCompare(b.word));

    const index = days % sortedVocabs.length;
    signOfTheDay = sortedVocabs[index] ?? sortedVocabs[0];
    return signOfTheDay;
  }
};

// check if sign of the day exists in SOTD column (check for today's date)
const checkSignOfTheDay = async () => {
  const today = formatDate();
  const vocabItems = await fetchVocabData();
  const signsOfTheDay = vocabItems
    .filter((obj) => obj.sotd != null) // Check for both null and undefined
    .filter((obj) => obj.sotd?.toString() === today) // Safe conversion
    .sort((a, b) => a.word.localeCompare(b.word));
  return signsOfTheDay[0];
};

// Get date in yyyy-mm-dd format
const formatDate = (date) => {
  const d = date ? new Date(date) : new Date();
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};
