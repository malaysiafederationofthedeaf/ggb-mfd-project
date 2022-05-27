import XLSX from "xlsx";
import axios from "axios";

import { Store } from "../../flux";

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
  const reconData = data.map((item) => ((item.KumpulanKategori !== undefined && item.GroupCategory !== undefined && item.Word !== undefined && item.Perkataan !== undefined )&& {
    kumpulanKategori: item.KumpulanKategori.toString().replaceAll(/(\r\n|\n|\r)/gm, ''),    
    groupCategory: item.GroupCategory.toString().replaceAll(/(\r\n|\n|\r)/gm, ''),    
    word: item.Word.toString().trim(),
    perkataan: item.Perkataan.toString().trim(),
    video: item.Video,
    tag: item.Tag,
    release: item.Release,
    new: item.New,
    order: item.Order,
    sotd: item.SOTD,
    sotdrec: item.SOTDREC,
  }));

  // if there is only 1 Release to include
  // return filterExcelData(reconData, "Release 1");

  // if there are multiple Releases to include, use an array
  return filterExcelData(reconData, ["Release 1", "Release 2", "Release 3"]);
};

const filterExcelData = (excelData, releases) => {
  return excelData
    .filter((group) => (group !== false)) // filter out those without any value
    .filter((group) => 
      Array.isArray(releases) ? (releases.includes(group.release)) : (group.release === releases)
    ) // filter out those that are not in 'release'
    .sort((a, b) => (a.kumpulanKategori).localeCompare(b.kumpulanKategori) // sort the entries alphabetically based on the Kategori
    );
}

const readExcel = async () => {
  const url = Store.getBaseURLBIMSheet();
  const file = await fetchData(url);
  //Export def
  const promise = new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const wb = XLSX.read(arrayBuffer, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]]; // first sheet: BIM sheet
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
