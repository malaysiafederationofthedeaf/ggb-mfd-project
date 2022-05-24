import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import * as XLSX from 'xlsx';

import './style.css';

//AMIRAH DONE
export const FileUploader = ({excell}) => {

    //used to get excel from others
    //var [excel,setExcel]=useState([]);


    // var excel;
    // var excelfile;
    // var fileReader;
    // var bufferArray;
    var wb;
    var ws=[];
    var wsnames=[];

    //images upload
    var [files, setFiles] = useState([]);

    //internet status
    var internetstatus;


   
    // const readReactFile=(file)=>{ 
    //     excel=file;
    // }

    //read image upload after upload excel
    const onInputChange = (e) => {

        var amirah;
        axios.request({
            responseType: 'arraybuffer',
            url: "./assets/BIM.xlsx",
            method: 'get',
            headers: {
            'Content-Type': 'blob',
            },
          })
          .then(res=>{
                //reset numbers of worksheet in excel holder
                ws=[];

                //reset names of sheets in excel holder
                wsnames=[];

                amirah=res.data;
                wb = XLSX.read(amirah,{type: "buffer" })
                for(let i=0;i<wb.SheetNames.length;i++){
                    ws.push(wb.Sheets[wb.SheetNames[i]]);
                    wsnames.push(wb.SheetNames[i]);
                }
                console.log(ws)
                var condition = navigator.onLine ? 'online' : 'offline';
                if (condition === 'online') {
                console.log('ONLINE');
                internetstatus="good";
                    fetch('https://www.google.com/', { // Check for internet connectivity
                        mode: 'no-cors',
                        })
                    .then(() => {
                        console.log('CONNECTED TO INTERNET');
                        internetstatus="good";
                    })
                    .catch(() => {
                    console.log('INTERNET CONNECTIVITY ISSUE');
                    internetstatus="not good";
                    })

                }else{
                console.log('OFFLINE');
                internetstatus="not good";
                }


                //check if excel is fetch
                if(wb!=null){
                    files=e.target.files;
                    console.log(files);
                }else{
                    toast.error("xlsx not detected");
                }
          })
          .catch(err=>console.log("failed to get excel"))

    };

    //click button upload will go here to process excel after upload image
    const onSubmit = async (e) => {
        e.preventDefault();

        console.log("inetrnet status = "+internetstatus);

        //check internet or error
        if(internetstatus!=="not good"){

            //check if excel is detected or error
            if(wb!=null){

                //data will hold array of Image names that have no error (when filter below) to process in xlsx
                const data = [];
                //ImageFile will hold array of Image files that have no error (when filter below) to process in xlsx
                const ImageFile=[];

                //check Image must be less than 10 or error
                if(files.length<=10) {

                    //go through every Image
                    for(let i = 0; i < files.length; i++) {

                        //check each Image must have image type .jpg or else will not upload and error for that image
                        if(files[i].type==="image/jpeg"){

                            //check Image size must lower than 5MB or else will not upload and error
                            if(files[i].size<5242880){

                                //if Image no error than its Image name will added into data array to upload in excel below
                                data.push(files[i].name);
                                //if Image no error than its Image file will added into ImageFile array to upload in server below
                                ImageFile.push(files[i]);
                                


                            }else{
                                toast.error("Image " +files[i].name+ " is more than 5MB")
                                console.log("Image " +files[i].name+ " is more than 5MB")
                            }
                        }else{
                            toast.error("File " +files[i].name+ " is not .jpg file")
                            console.log("File " +files[i].name+ " is not .jpg file")
                        }
                    }

                    console.log("data length="+data.length);
                    console.log("files length="+ImageFile.length);

                    //Success filter image and proceed to xlsx update process

                    //data for every row in 'BIM'/ws[0] sheets
                    var dataxlsx=XLSX.utils.sheet_to_json(ws[0]);

                    //go through each row in xlsx
                    for(let i=1;i<dataxlsx.length;i++){
                        //if Perkataan not same with ImagePath (if ImagePath not empty (already upload))
                        if(dataxlsx[i].Perkataan!==""){
                            
                            if(dataxlsx[i].Perkataan!==dataxlsx[i].ImagePath.replace(".jpg","")){
                                
                                toast.error("Row number "+(i+2)+" Perkataan does not match with its ImagePath");
                                console.log("Row number "+(i+2)+" Perkataan does not match with its ImagePath");
                            }else{
                                console.log(dataxlsx[i].ImagePath);
                            }
                        }

                        //go through every Image names for each row in xlsx
                        for(let z=0;z<data.length;z++){
                            //if Perkataan is same with filename
                            if(dataxlsx[i].Perkataan===(data[z].replace(".jpg",""))){

                                //if Image already upload then it will not overwrite existing record
                                if(dataxlsx[i].Status==="RECEIVED"){
                                    //Remove image from files if its already uploaded
                                    ImageFile.splice(z,1);
                                    toast.error(data[z]+" is not uploaded since it already exist!");
                                    console.log(data[z]+" is not uploaded since it already exist!");
                                }else{
                                    //put Image name in ImagePath and Status become received
                                    toast.success(data[z]+" is successfully uploaded")
                                }

                                //remove from the list Image names if matched above so we can know
                                //the remaining Image names in data has not match with any perkataan
                                //will print error of those Image names after go through each row
                                data.splice(z,1);
                                
                            }
                        }
                    }
                    //toast error remaining Image names (because of not matched with any perkataan)
                    for(let e=0;e<data.length;e++){
                        toast.error(data[e]+" is not uploaded since it not matched with any Perkataan!");
                        console.log(data[e]+" is not uploaded since it not matched with any Perkataan!");
                    }

                    //remove image that does not matched with any perkataan in ImageFile by compare with data and ImageFile
                    for(let q=0;q<ImageFile.length;q++){
                        for(let e=0;e<data.length;e++){
                            if(ImageFile[q].name===data[e]){
                                ImageFile.splice(q,1);
                                break;
                            }
                            
                        }

                    }

                    var dataImages = new FormData();

                    for(let i=0;i<ImageFile.length;i++){
                        dataImages.append('file',ImageFile[i]);
                        console.log(ImageFile[i].name+" has been append to upload")
                    }

                    axios.post("//localhost:8001/upload",dataImages)
                    .then((e)=>{
                        console.log("Images has been upload in server")
                    }).catch((e)=>{
                        console.log("Images failed to upload in server")
                    })
                }else {
                    toast.error("Exceed 10 files, please refresh and try again");
                    console.log("Exceed 10 files, please refresh and try again");
                }
            }else{
                toast.error("No images were selected.~");
            }
        }else{
            toast.error("Unstable internet connection. Please check your internet and refresh your page");
        }

        
        
    };

    return (
        <div>
            <form method="post" action="#" id="#" onSubmit={onSubmit}>
                <div className="form-group files">
                    <h1 >Choose your photo with rules given </h1>
                    <input type="file" 
                            accept='.jpg'
                        onChange={onInputChange}
                        className="form-control"
                        multiple/>
                    
                </div>
                <br/>
                <h5>Upload photo with .jpg format only</h5> 
                <h5>Upload maximum 10 photos only in one go</h5> 
                <h5>Upload photo with LESS than 5MB size only</h5> 
                <br/>
                <h1>Upload to process</h1>
                <button>Upload</button><br/><br/>
            </form>
        </div>
       
    )
    
};