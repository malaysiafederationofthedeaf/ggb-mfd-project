import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

import './style.css';

var t;
var opi = 1;
var opj = false;

export const ExcelUploader = ({onSuccess}) => {
  
    var bim = "BIM.xlsx";
    const [ve, setVe] = useState('');
    
    var message = "";
    var [files, setFiles] = useState([]);
    const [items, setItems] = useState([]);    
    const [itemsG, setItemsG] = useState([]);
    
    const readReactFile=(file)=>{
      const inputPromise = new Promise((resolve, reject) => {
  
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
  
        fileReader.onload = (e) => {
            
            const bufferArray = e.target.result;
            const wb = XLSX.read(bufferArray,{type: "buffer" });

            const wbl = wb.SheetNames.length;
            var dataBIM, dataG;
            if (wbl===2){
                const wsNameBIM = wb.SheetNames[0];
                const wsBIM = wb.Sheets[wsNameBIM];
                dataBIM = XLSX.utils.sheet_to_json(wsBIM);

                const wsNameG = wb.SheetNames[1];
                const wsG = wb.Sheets[wsNameG];
                dataG = XLSX.utils.sheet_to_json(wsG);
            }
            else {
                message += "BIM sheet and Group sheet not found. Please upload the latest version of BIM.xlsx.";
            }
            resolve([dataBIM, dataG]);

            if(wb!=null) {
                files=e.target.files;
            } else {
                message += "\nFile error: .xlsx data not detected.";
            }
        };

        fileReader.onerror = ((error) => { reject(error); });
      });      

      inputPromise.then((inData)=> {
        setItems(inData[0]);
        setItemsG(inData[1]);
      })
    };

    function removeDuplicates (items) {
        return items.filter((item, index) => items.indexOf(item) === index);
    }
    
    function checkFileUploaded (dBIM, dGroup){
        var pass = true;
        if (dBIM === undefined || dGroup === undefined) {  
            pass = false;
        }
        return pass;
    }

    function checkColumnDefined(dBIM, dGroup){
        var pass = true;
        if (items[0].RepeatPerkataan===undefined || items[0].RepeatWord===undefined){
            pass = false;
        }

        if (dGroup[0].RepeatKumpulanKategori===undefined || dGroup[0].RepeatGroup===undefined){
            pass = false;
        }
        return pass;
    }

    function checkRepeatBIM (items){
        var msg = "";
        var result = true;

        var rPerkataan = items.filter(items => items.RepeatPerkataan).length;
        var rWord      = items.filter(items => items.RepeatWord).length;

        if (rPerkataan >0) {
            msg = ("\n" + rPerkataan + " duplicated data found with similar Perkataan as the following:\n" 
                            + removeDuplicates(items.filter(items => items.RepeatPerkataan).map((item) => (item.Perkataan)))); 
            result = false;
        } else if (rPerkataan === 0) {
        } else { 
            msg = ("\nFile error: The file uploaded is not the latest version of BIM Worksheet. (Column RepeatPerkataan not found)\n"); 
        }
        
        if (rWord > 0) {
            msg += ("\n" + rWord + " duplicated data found with similar Word(s) as the following:\n" 
                    + removeDuplicates(items.filter(items => items.RepeatWord).map((item) => (item.Word))));
            result = false;
        } else if (rWord === 0) {
        } else {
            msg += "\nFile error: The file uploaded is not the latest version of BIM Worksheet. (Column RepeatWord not found)\n"; 
        }

        message += msg;
        msg = "";
        return (result);
    }

    function checkRepeatGroup (itemsG) {
        var msg2 = "";
        var result2 = true;

        var rKumpulan = itemsG.filter(itemsG => itemsG.RepeatKumpulanKategori).length;
        var rGroup    = itemsG.filter(itemsG => itemsG.RepeatGroup).length;
        if (rKumpulan > 0) {
            msg2 = ("\n" + rKumpulan + " duplicated data found with similar KumpulanKategori as the following:\n" 
                            + removeDuplicates(itemsG.filter(itemsG => itemsG.RepeatKumpulanKategori).map((item) => (item.KumpulanKategori))));
            result2 = false;
        } else if (rKumpulan === 0) {
        } else {
            msg2 = "\nFile error: The file uploaded is not the latest version of BIM Worksheet. (Column RepeatKumpulanKategori not found)\n";
        }

        if (rGroup >0) {
            msg2 += ("\n" + rGroup + " duplicated data found with similar GroupCategory as the following:\n" 
                            + removeDuplicates(itemsG.filter(itemsG => itemsG.RepeatGroup).map((item) => (item.GroupCategory)))); 
            result2 = false;
        } else if (rGroup === 0) {
        } else {
            msg2 += ("\nFile error: The file uploaded is not the latest version of BIM Worksheet. (Column GroupCategory not found)\n");
        }
        
        message += "\n" + msg2;
        msg2="";
        return (result2);
    }

    function checkDataDuplication(items, itemsG){
        var resBIM   = checkRepeatBIM(items);
        var resGroup = checkRepeatGroup(itemsG);

        if (resBIM && resGroup){
            return true;
        } else{
            return false;
        }
    }

    function breakline(msg) {
        var msgList = "";        
        msgList = msg.split('\n');

        if(document.getElementById("holder") != null){
            var holder = document.getElementById("holder");

            holder.innerHTML = "";
            for (let i = 0; i < msgList.length; i++) {
                holder.innerHTML += "<p>" + msgList[i] + "</p>";
            }
        }
    }
    
    const onInputChange = (e) => {
        setFiles(e.target.files);

        if(e.target.files[0]){
            if((e.target.files[0].name === "BIM.xlsx")||(e.target.files[0].name === "BIM.xls")){
                t = e.target.files[0].name;
                readReactFile(e.target.files[0]);
            }else{                
                t = "";
                
            }
        }
    };

    const verifyExcel = (e) => {
        let showbtn = false;
        opj = true;

        try {
            if (t === bim) {
                if(checkFileUploaded(items, itemsG)){
                    if (checkColumnDefined(items, itemsG)){
                        if(checkDataDuplication(items, itemsG)){
                            showbtn = true;
                            message += "\nNo file issue.";
                        }
                    }else {
                        message += "\nFile error: The file uploaded does not contain validation data.";
                    }
                } else {
                    message += "\nFile error: no data found.";
                }
            } else if (t===undefined){
                message += "No file choosen.";
            } else {
                message += "\nFile Error: System only accepts file name 'BIM.xlsx'. ";
            }
        
        } catch (error) {
            message += "\nError: No file choosen.";
        }  
        
        if (showbtn) {
            opi = 0;
        } else {
            opi = 1;
        }
        
        setVe(message);
        message = "";
    } 
   
    const onSubmit = (e) => {
        e.preventDefault();

        if(t === bim){
            const data = new FormData();
        
            if (checkDataDuplication(items, itemsG)) {
                for(let i = 0; i < files.length; i++) {
                    data.append('file', files[i]);
                }

                axios.post('//localhost:8000/upload', data,
                {headers:
                    {
                        'Content-Disposition': "attachment;",
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    },
                    responseType: 'arraybuffer',
                })
                .then((response) => {
                    window.alert("Successfully uploaded BIM.xlsx.");
                    console.log(response.data);
                    const redirect = window.location.protocol + "//" + window.location.host + "/admin/home";
                    window.location.assign(redirect);
                })
                .catch((e) => {
                    console.log(e);
                    window.alert("Upload Error: Connection Failed.\nPlease ensure you are connected to the internet.");
                })
            }
        }
        else {
            window.alert("Failed Upload: \nFile name must be 'BIM.xlsx' only.");
            e.preventDefault();
        }
    };
    
    return (
        <form method="post" action="#" id="#" onSubmit={onSubmit}>
            <div className="form-group files">
                <h1>Upload Your BIM.xlsx File </h1>
                <center><p>Only BIM.xlsx file will be accepted</p>
                <p>Please ensure that the BIM.xlsx has no unresolved conflict.</p></center>
                <input directory="BIM.xlsx" type="file"
                id="BIM"
                name="BIM"
                accept='.xlsx'
                onChange={onInputChange}
                />
            </div>
            <center>
                <div id="btn-choose" onClick={verifyExcel}>Verify</div>
            </center><br/><br/>
            <br/>
            
            {opj === true
            ? <center>{breakline(ve)}
            
            <div id="ve"><div id="holder"></div></div>
                {opi === 0
                ? <center>
                    <div>
                        <button id="btn-choose">Submit</button>
                    </div>
                </center>
                : <center><div id="btn-choose" hidden>Submit</div></center>
                }
            </center>
            : <center></center>
            }
            <br/><br/>
        </form>
    )
};
