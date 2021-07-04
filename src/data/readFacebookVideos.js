import axios from "axios";
import { Store } from "../flux";

const ONE_SIGN_DAY_HASHTAG = '#satuharisatuisyarat';

// Sign word is encapsulated in two * on FB page
const getTitleFromDescription = (desc) => {
  const startIndex = desc.indexOf('*') + 1;
  const endIndex = desc.lastIndexOf('*');
  return desc.substring(startIndex, endIndex);
};

// Filtered to only show videos with one sign a day hashtag
// Only return top 10 results
const readFacebookVideos = async () => {
  const fbUrl = Store.getFacebookVideosUrl();

  return axios.get(fbUrl).then((res) => {
    const filteredItems = res.data.data
      .filter(item => item.description.includes(ONE_SIGN_DAY_HASHTAG))
      .map((item) => {
        return {
          id: item.id,
          description: item.description,
          title: getTitleFromDescription(item.description),
          url: Store.generateFacebookVideoUrl(item.id),
        };
      });
      return filteredItems.slice(0, 10);
  }).catch((e) => {
    console.log(e);
    return [];
  });
};

export default readFacebookVideos();