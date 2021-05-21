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
  const reconData = data.map((item) => ((item.Group !== undefined && item.Kumpulan !== undefined && item.Category !== undefined && item.Word !== undefined && item.Perkataan !== undefined )&& {
    group: item.Group,
    kumpulan: item.Kumpulan,
    category: item.Category,
    kategori: item.Kategori,
    word: item.Word.toString(),
    perkataan: item.Perkataan.toString(),
    video: item.Video,
    tag: item.Tag,
    release: item.Release,
  }));

  return filterExcelData(reconData, "Release 1");
};

const filterExcelData = (excelData, release) => {
  return excelData
    .filter((group) => (group !== false)) // filter out those without any value
    .filter((group) => (group.release === release)) // filter out those that are not in "Release 1"
    .sort((a, b) => (a.perkataan).localeCompare(b.perkataan) // sort the entries alphabetically based on the Word (English)
    );
}

const getBaseURL = () => {
  const baseURL = window.location.origin;
  // const filePathname = "/assets/BIM_Test_1.xlsx"; // Test file
  const filePathname = "/assets/GGB-MFD-BIM-SignBank-Category.xlsx";
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
