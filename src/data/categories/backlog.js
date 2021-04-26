import { useState } from "react";
import XLSX from "xlsx";
import axios from "axios";
import useSWR from "swr";

const backlog = () => {
  const [excelItems, setExcelItems] = useState([]);

  const { data } = useSWR(
    "assets/BIM_Test_1.xlsx",
    (url) =>
      axios({
        method: "get",
        url: url,
        responseType: "blob",
      }).then((res) => {
        readExcel(res.data);
      }),
    { dedupingInterval: 10000 }
  );

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(file);
      fileReader.onload = (e) => {
        const arrayBuffer = e.target.result;

        const wb = XLSX.read(arrayBuffer, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((d) => {
      restructureJSON(d);
    });
  };

  const restructureJSON = (data) => {
    const cats = [...new Set(data.map((i) => i.Category))];
    const words = (cat) =>
      data
        .filter((word) => word.Category === cat)
        .map((items) => ({
          word: items.Word,
          wordMalay: items.Perkataan,
          // image: require(`../../images/mfd/vocabs/greetings/${items.Image}`),
          video: items.Video,
        }));

    const reconData = [
      cats.map((cat) => ({
        category: cat,
        categoryMalay: cat,
        vocabs: words(cat),
      })),
    ];
    console.log(reconData);
    setExcelItems(reconData);
  };

  return excelItems;
};

export default backlog;
