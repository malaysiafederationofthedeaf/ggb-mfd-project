import { useState, useEffect } from "react";
import XLSX from "xlsx";
import axios from "axios";
import useSWR from "swr";
export default function() {
  const [excelItems, setExcelItems] = useState({
    loading: true,
    excelItem: [],
  });

  let readExcel = (file) => {
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
      // console.log(d);
      restructureJSON(d);
    });
  };

  const restructureJSON = (data) => {
    const cats = [...new Set(data.map((i) => i.Category))];
    const grps = [...new Set(data.map((i) => i.Group))];

    const groups = (grps) =>
      grps.map((group) => ({
        categoryGroup: group,
        categories: data
          .filter(
            (grp, index, self) =>
              grp.Group === group &&
              index === self.findIndex((t) => t.Category === grp.Category) //get unique values
          )
          .map((grp) => ({ title: grp.Category })),
      }));

    const titles = (cats) =>
      cats.map((categ) => ({
        title: categ,
        vocabs: data
          .filter((cat) => cat.Category === categ)
          .map((cat) => ({ word: cat.Word })),
      }));

    const reconData = groups(grps).map((grp) => {
      const titleArr = grp.categories.map((catTitle) => catTitle.title);
      const title = titles(cats)
        .filter((cat) => titleArr.includes(cat.title))
        .map((cat) => cat);
      Object.assign(grp.categories, title);
      return grp;
    });

    setExcelItems({ loading: false, excelItem: reconData });
  };

  const { data } = useSWR(
    "assets/BIM_Test_1.xlsx",
    (url) =>
      axios({
        method: "get",
        url: url,
        responseType: "blob",
      }).then((res) => res.data),
    { dedupingInterval: 2000, suspense: true }
  );

  useEffect(() => {
    readExcel(data);
  }, [data]);

  const backlog = excelItems.excelItem.length !== 0 ? excelItems.excelItem : [];
  // console.log(backlogItems);
  return backlog;
}
