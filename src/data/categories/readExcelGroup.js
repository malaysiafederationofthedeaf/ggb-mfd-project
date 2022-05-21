import * as XLSX from 'xlsx';
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

const restructureJSONGroup = (data) => {
  const reconData = data.map((item) => ((item.KumpulanKategori !== undefined && item.GroupCategory !== undefined )&& {
    kumpulanKategori: item.KumpulanKategori.trim(),    
    groupCategory: item.GroupCategory.trim(),
    remark: item.Remark,
  }));
  return reconData
    .filter((group) => (group !== false));
};

const readExcelGroup = async () => {
  const url = Store.getBaseURLBIMSheet();
  const file = await fetchData(url);
  //Export def
  const promise = new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const wb = XLSX.read(arrayBuffer, { type: "binary" });
      // read Group sheet
      const ws = wb.Sheets[wb.SheetNames[1]]; // second sheet: Group sheet
      const data = XLSX.utils.sheet_to_json(ws);
      const reconData = restructureJSONGroup(data);
      resolve(reconData);      
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
  return promise;
};

export default readExcelGroup();
