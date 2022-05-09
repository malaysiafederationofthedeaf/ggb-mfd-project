import {useState} from 'react';
import axios from 'axios';
import { toast} from 'react-toastify';
// import {ProgressBar} from 'react-bootstrap';
// import { IsEqual, StartCase } from 'react-lodash'
import * as XLSX from 'xlsx';

import './style.css';
var t;

export const ExcelUploader = ({onSuccess}) => {
    
    var bim = "BIM.xlsx";

    // START DKIP-151
    var wb;
    var [files, setFiles]   = useState([]);
    const [items, setItems] = useState([])

    const readReactFile = (file) => {

      const inputPromise = new Promise((resolve, reject) => {

        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
  
        fileReader.onload = (e) => {
            
            const bufferArray = e.target.result;
            wb = XLSX.read(bufferArray,{type: "buffer" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);
            resolve(data);

            // if excel fetch
            if(wb!=null) {
                files=e.target.files;
                console.log(files);
            } else {
                window.alert("xlsx not detected");
            }
        };

        fileReader.onerror = ((error) => {
          reject(error);
        });
      });
  
      inputPromise.then((inData)=> {
        setItems(inData);
      })
    };

    function removeDuplicates (items) {
        return items.filter((item, index) => items.indexOf(item) === index);
      }
      const count = items.filter(items => items.Column22).length;
    // END DKIP-151
    

    const onInputChange = (e) => {
        setFiles(e.target.files)
        
        console.log(typeof e.target.files[0].name)
        if((e.target.files[0].name == "BIM.xlsx") || (e.target.files[0].name == "BIM.xls")) {
            t = "BIM.xlsx" 
            // START DKIP-151
            readReactFile(e.target.files[0]);
            // END DKIP-151
        }
    };
    
    const onSubmit = (e) => {
        
        e.preventDefault();

        if(t === bim){
        const data = new FormData();
        
        // START DKIP-151
        if (count > 0) {
            console.log(count);
            window.alert(count + " duplicated data found with similar Word(s) as the following:\n" + removeDuplicates(items.filter(items => items.Column22).map((item) => (item.Column2))))
            // alert(items.filter(items => items.Column19).length + " Duplicate data found in the worksheet: " + items.filter(items => items.Column19).map((item) => + " " + item.Column2))
        } else {
            // END DKIP-151

            for(let i = 0; i < files.length; i++) {
                data.append('file', files[i]);
            }
            
            axios.post('//localhost:8000/upload', data, {
                headers: {
                    'Content-Disposition': "attachment;",
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
                responseType: 'arraybuffer',
                onUploadProgress: progressEvent => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log(`upload process: ${percentCompleted}%`);
                }}).then((response) => {
                    // toast.success('Upload Success');
                    // window.alert("Upload BIM.xlsx successfully");
                    toast.success('Upload BIM.xlsx successfully');
                    
                    onSuccess(response.data)
                }).catch((e) => {
                    // toast.error('Upload Error')
                    toast.error('Cannot connect to server.\nPlease make sure you are connected to the Internet and try again')
                    // window.alert("Cannot connect to server.\nPlease make sure you are connected to the Internet and try again");
                })
        }
            
        // START DKIP-151
        }
        // END DKIP-151
        else {
                // window.alert("Unsuccessful upload BIM.xlsx\n-Please Select the Correct File (BIM.xlsx only)")
                toast.alert('Unsuccessful upload BIM.xlsx\n-Please Select the Correct File (BIM.xlsx only)');
                e.preventDefault();
            }
    };
    
    return (
        <form method="post" action="#" id="#" onSubmit={onSubmit}>
            <div className="form-group files">
                <h1>Upload Your BIM.xlsx File </h1>
                <input directory="BIM.xlsx" 
                    type="file" id="BIM"
                    name="BIM"
                    accept='.xlsx'
                    onChange={onInputChange}
                    className="form-control"
                />
                <ul id="listing"></ul>
            </div>
            
            <h3>Only .xlsx file will be accepted</h3>
            <button>Submit</button>
        </form>
    )
};