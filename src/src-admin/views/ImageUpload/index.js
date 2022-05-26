import { React, useState, useRef } from "react";
import axios from 'axios';
import * as XLSX from 'xlsx';

import "./style.css";

export const ImageUpload=()=>{
    const inputFileRef = useRef( null );
    const [filearray,setFilearray]=useState([]);
    var filetemparray=[];
    const [mode,setMode] = useState("not uploaded");
    const [errordiv,setErrordiv]=useState([]);
    const [successdiv,setSuccessdiv]=useState([]);
    const [wsheets,setWsheets] = useState([]);
    const [wsheetsname,setWsheetsnames]=useState([]);

    var excel;
    var ws=[];
    var wsnames=[];
    var wb;


    var errorlist=[];
    // var errorname=[];
    // var errorreason=[];
    var successlist=[];
    


    const ClickChooseImage = () => {

        axios.request({
            responseType: 'arraybuffer',
            url: "./assets/BIM.xlsx",
            method: 'get',
            headers: {
            'Content-Type': 'blob',
            },
          })
        .then(res=>{
            ws=[];
            wsnames=[];
            excel=res.data;
            wb = XLSX.read(excel,{type: "buffer" });
            for(let i=0;i<wb.SheetNames.length;i++){
                ws.push(wb.Sheets[wb.SheetNames[i]]);
                wsnames.push(wb.SheetNames[i]);
            }
            
    
            var condition = navigator.onLine ? 'online' : 'offline';
            if (condition === 'online') {
                fetch('https://www.google.com/', { // Check for internet connectivity
                    mode: 'no-cors',
                })
                .then(() => {
                    if(wb!=null){
                        setWsheets(ws);
                        setWsheetsnames(wsnames)
                        inputFileRef.current.click();
                    }else{ 
                        window.alert("BIM.xlsx is not detected, please upload BIM.xlsx at ExcelUploader");
                    }
                            
                    })
                .catch(() => {
                    window.alert("Unstable internet connection. Please check your internet and refresh your page");
                })
    
            }else{
                window.alert("Unstable internet connection. Please check your internet and refresh your page");
            }
              
        })
        .catch(err=>{
            window.alert("BIM.xlsx is not detected, please upload BIM.xlsx at ExcelUploader");
    
        })

    };

    const ChooseImage =(event)=>{

        filetemparray=event.target.files;
        console.log(filetemparray);
        setFilearray([...filearray,...filetemparray]);
    }

    const Removeitem = (itemname) => {
        var temparray = [];
        filearray.map((item)=>item.name!==itemname?temparray.push(item):item)
        setFilearray(temparray);
    }

    const UploadAgain = () =>{
        window.location.reload();
    }

    //replace image
    const Replaceitem=(itemfile)=>{
        console.log(errorlist);
        var tempsuccesslist = [...successlist];
        var temperrorlist=[...errorlist];
        var dataImagesreplace = new FormData();
        dataImagesreplace.append('file',itemfile);
        axios.post("//localhost:8001/upload",dataImagesreplace)
            .then((e)=>{
                console.log(itemfile.name+ " has been replaced");
                for(let i=0;i<temperrorlist.length;i++){
                    if(temperrorlist[i].props.children[1].props.children[0].props.children===itemfile.name){
                        temperrorlist.splice(i,1);

                    }
                }
                tempsuccesslist.push(
                    <div>
                        <div>{itemfile.name}</div>
                        <div>Successfully replaced the image</div>
                    </div>
                )
                successlist=[...tempsuccesslist]
                errorlist=[...temperrorlist]
                setSuccessdiv(tempsuccesslist);
                setErrordiv(temperrorlist)

                
            }).catch((e)=>{
                console.log("Images failed to upload in server")
            })

    }

    const UploadImages=()=>{

        
        //ImageFile will hold array of Image files that have no error (when filter below) to process in xlsx
        const ImageFile=[];

        //check Image must be less than 10 or error
        if(filearray.length<=10) {

            //go through every Image
            for(let i = 0; i < filearray.length; i++) {

                //check each Image must have image type .jpg or else will not upload and error for that image
                if(filearray[i].type==="image/jpeg"){

                    //check Image size must lower than 5MB or else will not upload and error
                    if(filearray[i].size<5242880){

                        //if Image no error than its Image file will added into ImageFile array to upload in server below
                        ImageFile.push(filearray[i]);

                    }else{
                        errorlist.push(
                            <div>
                                <div>{filearray[i].name}</div>
                                <div>Upload Failed: More than 5MB! </div>
                            </div>
                        )
                    }
                }else{
                    errorlist.push(
                        <div>
                            <div>{filearray[i].name}</div>
                            <div>Upload Failed: Not .jpg type!</div>
                        </div>
                    )
                }
            }

            console.log("files length="+ImageFile.length);

            //Success filter image and proceed to xlsx update process

            //data for every row in 'BIM'/ws[0(BIM)/2(Validation)] sheets
            var dataxlsx=XLSX.utils.sheet_to_json(wsheets[0]);
          

            var ImageFileSuccess=[];
            var ImageFileUnsuccess=[];
            //go through each row in xlsx
            for(let i=0;i<dataxlsx.length;i++){

                //go through every Image names for each row in xlsx
                for(let z=0;z<ImageFile.length;z++){
                    
                    //if Perkataan is same with filename
                    if(dataxlsx[i].Perkataan===(ImageFile[z].name.replace(".jpg",""))){
                        console.log(ImageFile[z].name+" same with perkataan")
                        if(dataxlsx[i].Status==="RECEIVED"){
                            console.log(ImageFile[z].name+" not success to upload since exist in excel")
                            ImageFileUnsuccess.push(ImageFile[z]);
                            errorlist.push(
                                <div id="bapakexist">
                                    <div id="anakexist"><div id="gapre"></div></div>
                                    <div id="anakexist">
                                        <div>{ImageFile[z].name}</div>
                                        <div>Upload Failed: already exist in excel!</div>
                                        
                                    </div>
                                    <div id="anakexist">
                                        <div id="replacebutton" onClick={()=>Replaceitem(ImageFile[z])}>
                                            replace
                                        </div>
                                    </div>
                                </div>
                                
                            )
                        }else{
                            console.log(ImageFile[z].name+" success to upload")
                            ImageFileSuccess.push(ImageFile[z]);
                        }

                        
                    }
                }
            }

            var ImageFileSame=[...ImageFileSuccess,...ImageFileUnsuccess];
            var ImageFileNotSame=[];
            var same;
            for(let i=0;i<ImageFile.length;i++){
                same="no";
                for(let j=0;j<ImageFileSame.length;j++){
                    if(ImageFile[i].name===ImageFileSame[j].name){
                        same="yes";
                    }
                }
                if(same==="no"){
                    ImageFileNotSame.push(ImageFile[i]);
                }
            }

            for(let i=0;i<ImageFileNotSame.length;i++){
                errorlist.push(
                    <div>
                        <div>{ImageFileNotSame[i].name}</div>
                        <div>Upload Failed: Not match with any Perkataan!</div>
                    </div>
                )
            }

            var dataImages = new FormData();

            for(let i=0;i<ImageFileSuccess.length;i++){
                dataImages.append('file',ImageFileSuccess[i]);

                successlist.push(
                    <div>
                        <div>{ImageFileSuccess[i].name}</div>
                        <div>Successfully uploaded the image</div>
                    </div>
                );
                console.log(ImageFileSuccess[i].name+" has been append to upload")
            }

            axios.post("//localhost:8001/upload",dataImages)
            .then((e)=>{
                setErrordiv(errorlist);
                setSuccessdiv(successlist);
                setMode("uploaded");
                
            }).catch((e)=>{
                console.log("Images failed to upload in server")
            })

            

        }else {
            window.alert("Please remove some files to not exceed 10 files");
            console.log("Please remove some files to not exceed 10 files");
        }
    }

    return(
        <div id="main">
            <h1>Upload sign images</h1>
            <p>Each image size must not exceed 5MB</p>
            <p>All image must be in .jpg format (not more than 10 images)</p>

            <input  type="file" 
                    ref={inputFileRef}
                    accept='.jpg'
                    onChange={ChooseImage}
                    hidden={true}
                    multiple/>
            {mode==="not uploaded"?
            <center><div id="btn-choose" onClick={ClickChooseImage}> + Choose Images</div>
                <div id="kotakputih">
                    {filearray.length>0?
                        filearray.map(item=>
                            <div id="filelist">
                                <p id="itemname">{item.name}</p>
                                <div id="itemremove" onClick={()=>Removeitem(item.name)}><span aria-hidden="true" >&times;</span></div>
                                <div id="gaptepilist"></div>
                            </div>
                        )
                    :<div id="withoutitem"></div>}
                </div>
            </center>
            :<center>
                {errordiv.length>0?<div id="kotakerror">
                
                    {errordiv.map(item=><div id="errorlistitem">{item}</div>)}
                
                </div>:<div></div>}
                <br/>
                {successdiv.length>0?<div id="kotaksuccess">
                    {successdiv.map(item=><div id="successlistitem">{item}</div>)}
                </div>:<div></div>}
            </center>
            }
            <center>
                <div id="bapakbutton">
                    {mode==="not uploaded"?<div id="btn-upload" onClick={UploadImages}> Upload </div>:<div id="btn-upload" onClick={UploadAgain}> Upload Again </div>}
                    <div id="gap"></div>
                    <div id="btn-cancel"> Cancel </div>
                </div>
            </center>
            <br/>
        </div>
        
    )
}
