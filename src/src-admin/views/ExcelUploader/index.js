import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

import './style.css';

var t;

export const ExcelUploader = ({onSuccess}) => {
  
    var bim = "BIM.xlsx";
    const [ve, setVe] = useState('');
    let opi = 1;
    
    // START DKIP-151
    var wb;
    var message;
    var [files, setFiles] = useState([]);
    const [items, setItems] = useState([]);    
    const [itemsG, setItemsG] = useState([]);
    
    const readReactFile=(file)=>{
      const inputPromise = new Promise((resolve, reject) => {
  
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
  
        fileReader.onload = (e) => {
          const bufferArray = e.target.result;
          wb = XLSX.read(bufferArray,{type: "buffer" });
        //   console.log("wb: ", wb);
        //   console.log("wb.SheetNames: ", wb.SheetNames.length);

          const wbl = wb.SheetNames.length;
        //   console.log("total Sheets: ", wbl===2);
          
          var dataBIM, dataG;
          if (wbl===2){
              const wsNameBIM = wb.SheetNames[0];
              const wsBIM = wb.Sheets[wsNameBIM];
              dataBIM = XLSX.utils.sheet_to_json(wsBIM);
            //   console.log(wsBIM + " dataBIM: ", dataBIM);

              const wsNameG = wb.SheetNames[1];
              const wsG = wb.Sheets[wsNameG];
              dataG = XLSX.utils.sheet_to_json(wsG);
            //   console.log(wsG + " dataG: ", dataG);
          } else {
              window.alert("BIM sheet and Group sheet not found. Please upload the latest version of BIM.xlsx.");
          }
          resolve([dataBIM, dataG]);

        // if excel fetch
        if(wb!=null){
            files=e.target.files;
            // console.log(files);
        }else{
            window.alert("xlsx not detected");
        }
        };

        fileReader.onerror = ((error) => {
          reject(error);
        });
      });      

      inputPromise.then((inData)=> {
        //   console.log("inDataBIM: ", inData[0]);
        //   console.log("inDataGroup: ", inData[1]);
        setItems(inData[0]);
        setItemsG(inData[1]);
      })
    };

    function removeDuplicates (items) {
        return items.filter((item, index) => items.indexOf(item) === index);
      }
    //   const count = items.filter(items => items.RepeatWord).length;

    function checkRepeatBIM (items){
        console.log("[START checkRepeatBIM]");
        var rPerkataan = items.filter(items => items.RepeatPerkataan).length;
        var rWord = items.filter(items => items.RepeatWord).length;
        // console.log(rPerkataan + " > 0:" + (rPerkataan>0));
        // console.log(rWord + " > 0:" + (rWord>0));
        
        var msg;
        if (rWord > 0){
            msg = ("\n" + rWord+ " duplicated data found with similar Word(s) as the following:\n" + removeDuplicates(items.filter(items => items.RepeatWord).map((item) => (item.Word))));
        } else if (rWord === 0){
            msg = ("");
        } else {
            msg = ("\nColumn not found\n");
        }

        if (rPerkataan >0){
            msg += ("\n" + rPerkataan + " duplicated data found with similar Perkataan as the following:\n" + removeDuplicates(items.filter(items => items.RepeatPerkataan).map((item) => (item.Perkataan)))); 
        } else if (rWord === 0){
            msg += ("");
        } else {
            msg += ("\nColumn not found\n");
        }
        message = msg;
        // <div>{message}</div>

        // console.log("msg: ", msg);        
        // console.log("message: ", message);
        console.log(["END checkRepeatBIM"]);
        return ((rWord > 0 && rPerkataan > 0)) // if got duplicate, return true. else false
    }

    function checkRepeatGroup (itemsG) {
        console.log("[START checkRepeatGroup]");
        var rKumpulan = itemsG.filter(itemsG => itemsG.RepeatKumpulanKategori).length;
        var rGroup = itemsG.filter(itemsG => itemsG.RepeatGroup).length;
        var mm = itemsG.filter(items => itemsG.RepeatKumpulanKategori).map((item) => (item.KumpulanKategori));
        console.log(mm);
        console.log(rKumpulan + " > 0:" + (rKumpulan>0));
        console.log(rGroup + " > 0:" + (rGroup>0));

        var msg2;
        if (rGroup >0){
            msg2 = ("\n" + rGroup + " duplicated data found with similar GroupCategory as the following:\n" + removeDuplicates(itemsG.filter(itemsG => itemsG.RepeatGroup).map((item) => (item.GroupCategory)))); 
        } else if (rGroup === 0){
            msg2 += ("");
        } else {
            msg2 += ("\nColumn not found\n");
        }
        
        if (rKumpulan > 0){
            msg2 += ("\n" + rKumpulan+ " duplicated data found with similar KumpulanKategori as the following:\n" + removeDuplicates(itemsG.filter(itemsG => itemsG.RepeatKumpulanKategori).map((item) => (item.KumpulanKategori))));
        } else if (rKumpulan === 0){
            msg2 += ("");
        } else {
            msg2 += ("\nColumn not found\n");
        }

        message += "\n" + msg2;

        // console.log("msg2 ", msg2);
        // console.log("message: ", message);
        console.log(["END checkRepeatGroup"]);
        return ((rKumpulan > 0 && rGroup > 0)) // if got duplicate, return true. else false
    }

    function checkDataDuplication(items, itemsG){
        // if(checkRepeatBIM(items)) {  // if got duplicate, return true. else false
        //     console.log("has repeat data:? ", checkRepeatBIM(items));
        // } else {
        //     console.log("no repeat data.", checkRepeatBIM(items));
        // }

        // if (checkRepeatGroup(itemsG)) {
        //     console.log("has repeat dataG:? ", checkRepeatGroup(itemsG));
        // } else {
        //     console.log("no repeat dataG.", checkRepeatGroup(itemsG));
        // }

        if (checkRepeatBIM(items)&&checkRepeatGroup(itemsG)){// if got duplicate, return true. else false
            return true;
        } else{
            return false;
        }
    }
    // END DKIP-151

    
    

    const onInputChange = (e) => {
        setFiles(e.target.files);

        if(e.target.files[0]){
            // console.log(typeof e.target.files[0].name)
            // console.log("check e.target.files[0].name: ", typeof e.target.files[0].name + " " + e.target.files[0].name);
            // console.log(e.target.files[0].name+ "==''BIM.xlsx'' : ", e.target.files[0].name=="BIM.xlsx");
            // console.log(e.target.files[0].name+ "===''BIM.xlsx'': ", e.target.files[0].name==="BIM.xlsx");
            // console.log(e.target.files[0].name+ "==='BIM.xlsx'  : ", e.target.files[0].name==='BIM.xlsx');

            if((e.target.files[0].name === "BIM.xlsx")||(e.target.files[0].name === "BIM.xls")){
                t = "BIM.xlsx";
                // START DKIP-151
                readReactFile(e.target.files[0]);
                // END DKIP-151
            }
        } else {
            console.log(e.target.files[0]);
        }

    };

    
    const verifyExcel = (e) => {

        if (checkDataDuplication(items, itemsG)) {
            // console.log("checkDataDuplication(items, itemsG): ", checkDataDuplication(items, itemsG));
            console.log("message: ", message);

            setVe(message);
            // window.alert("Please resolve the issue(s) in the BIM.xlsx");
            // setVe(count + " duplicated data found with similar Word(s) as the following:\n" + removeDuplicates(items.filter(items => items.RepeatWord).map((item) => (item.Word))));
            // alert(items.filter(items => items.Column19).length + " Duplicate data found in the worksheet: " + items.filter(items => items.Column19).map((item) => + " " + item.Column2))


            
        } else{
            opi = 0;
            setVe("There is no duplication in Word and Perkataan");

        }
        console.log(ve);
    }
    
    const onSubmit = (e) => {
        
        e.preventDefault();

        if(t === bim){
        const data = new FormData();
        
        // START DKIP-151
        if (checkDataDuplication(items, itemsG)) {
            // console.log("checkDataDuplication(items, itemsG): ", checkDataDuplication(items, itemsG));
            console.log("message: ", message);
        } else {
            // END DKIP-151

            for(let i = 0; i < files.length; i++) {
                data.append('file', files[i]);
            }
            
            axios.post('//localhost:8000/upload', data,{headers:
            {
                'Content-Disposition': "attachment;",
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },responseType: 'arraybuffer',
                onUploadProgress: progressEvent => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log(`upload process: ${percentCompleted}%`);
                }
                
            })
                .then((response) => {
                    // toast.success('Upload Success');
                    window.alert("Upload BIM.xlsx successfully")
                    
                    onSuccess(response.data)
                })
                .catch((e) => {
                    // toast.error('Upload Error')
                    window.alert("Cannot connect to server.\nPlease make sure you are connected to the Internet and try again");
                })
            }
            
        // START DKIP-151
        }
        // END DKIP-151
        else {
                window.alert("Unsuccessful upload BIM.xlsx\n-Please Select the Correct File (BIM.xlsx only)")
                e.preventDefault();
            }
    };
    
    return (
        <form method="post" action="#" id="#" onSubmit={onSubmit}>
            <div className="form-group files">
                <h1>Upload Your BIM.xlsx File </h1>
                <p>Only BIM.xlsx file will be accepted</p>
                <p>Please ensure that the BIM.xlsx has no unresolved conflict.</p>
                <input directory="BIM.xlsx" type="file"
                id="BIM"
                name="BIM"
                accept='.xlsx'
                onChange={onInputChange}
                className="form-control"
                />
                
                <ul id="listing"></ul>
            </div>
            
            
            <center><div id="btn-choose" onClick={verifyExcel}>Verify</div></center><br></br><br></br>
            {console.log("ve: ",ve)}
            {console.log("ve: ",ve==="")}
            <center>
            <div id="ve"><p>{ve}</p></div>
            </center><br/><br/><br/>

            { opi === 1 ?  <center><div id="btn-choose"><button disabled={!ve}>Submit</button></div></center> :  <center><div id="btn-choose"><button >Submit</button></div></center>}
            
            {/* <center><div id="btn-choose"><button >Submit</button></div></center> */}<br/><br/>
        </form>
    )
};