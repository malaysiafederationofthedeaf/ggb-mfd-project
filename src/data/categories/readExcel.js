import XLSX from "xlsx";
import axios from "axios";

const fetchData = async (url) => {
  const data = await axios({
    method: "get",
    url: url,
    responseType: "blob",
  })
    .then((res) => res.data)
    .catch((err) => console.log(err));

  return data;
};

const restructureJSON = (data) => {
  const reconData = data.map((item) => ({
    group: item.Group,
    kumpulan: item.Kumpulan,
    category: item.Category,
    kategori: item.Kategori,
    word: item.Word,
    perkataan: item.Perkataan,
    video: item.Video,
  }));

  return reconData;
};

const getBaseURL = () => {
  const baseURL = window.location.origin;
  const filePathname = "/assets/BIM_Test_1.xlsx"; // Test file
  // const filePathname = "/assets/BIM_Test_1.xlsx"

  return baseURL + filePathname;
};

const readExcel = async () => {
  const url = getBaseURL();
  const file = await fetchData(url);
  //Export def
  const promise = new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const wb = XLSX.read(arrayBuffer, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      const reconData = restructureJSON(data);
      resolve(reconData);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
  return promise;
};

export default readExcel();
