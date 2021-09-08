import React, { useState ,useContext ,useEffect} from 'react'
import { AuthContext } from '../Context/AuthProvider';
import {Button,CardMedia}from '@material-ui/core';
import {PhotoCamera } from '@material-ui/icons';
import VideoPost from './VideoPost';
import Modal from "./Modal";


import { firebaseDB, firebaseStorage ,timeStamp} from '../Config/Firbase';
import {uuid} from 'uuidv4';
const Feeds = (props) => {
    const [file,setfile]=useState(null);
    const [posts,setposts]=useState([]);
    const [uploadVideoError,setUploadVideoError]=useState("");
    const [modalOpen, setModalOpen] = useState(false);
    
    let {signOut,currentUser}=useContext(AuthContext);
    function handlefileInput(e){
        let file=e.target.files[0];
        setfile(file);
    }

    

    let conditionObject={
        root:null,
        threshold:"0.8"
    };
    function cb(enteries){
        // console.log(enteries);
        enteries.forEach((entry)=>{
            let child=entry.target.children[0];
            // console.log(child);
            if(!child.classList.contains("image")){
                child.play().then(function(){
                    if(entry.isIntersecting ==false){
                        child.pause();
                    }
                })
            }
           
        })
        
    }
    useEffect(()=>{
      let ObserverObject=new IntersectionObserver(cb,conditionObject);
      let VideoElements=document.querySelectorAll(".video-conatiner");
       VideoElements.forEach((ele)=>{
           ObserverObject.observe(ele);
       })

    },[posts])

    useEffect(()=>{
        firebaseDB
      .collection("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        let allPosts = snapshot.docs.map((doc) => {
          return doc.data();
        });
        setposts(allPosts);
      });
    },[])

    async function handleOnUpload() {
        try{

            if (file.size / 1000000 > 5) {
                setUploadVideoError("Selected File Exceeds 5MB cannot upload !");
                return;
            }
           let uid=currentUser.uid;
           const uploadVideoObject=firebaseStorage.ref(`profileImage/${uid}/${Date.now()}.mp4`).put(file);

           uploadVideoObject.on("state_changed",fun1,fun2,fun3);
           function fun1(snapshot){
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
           }
           function fun2(err){
               console.log(err);
           }
           async function fun3(){
              let videoUploadUrl= await uploadVideoObject.snapshot.ref.getDownloadURL();
              let pid=uuid();
              await firebaseDB.collection("posts").doc(pid).set({
                  pid:pid,
                  uid:uid,
                  VideoLink:videoUploadUrl,
                  comment:[],
                  likes:[],
                  createdAt:timeStamp()
              });
              let doc=await firebaseDB.collection("users").doc(uid).get();
              let document=doc.data();
              await document.postCreated.push(pid);
              await firebaseDB.collection("users").doc(uid).set(document);
              setUploadVideoError("");
           }
        }catch(err){
            console.log(err.message);
        }
    }
    return ( 
        <>
            <div className="upload-file">
                <label>
                {/* <Button variant="contained" color="secondary" component="label" style={{marginTop:"5%"}}>Select File<input type="file" onChange={handlefileInput} hidden/></Button> */}
                <Button variant="contained" color="secondary" 
                  onClick={() => {
                    setModalOpen(true);
                  }}    
                  component="label" style={{marginTop:"5%"}} >Create New Post</Button>
                 {/* <Button variant="contained" color="secondary" onClick={handleOnUpload}  style={{marginTop:"5%"}}   startIcon={<PhotoCamera></PhotoCamera>}>Upload</Button> */}

                {modalOpen && <Modal setOpenModal={setModalOpen} />}
                
                </label>
            </div>
            <p>{uploadVideoError}</p>
            <div className="video-list"  style={{ margin: "auto" }}>
                     {
                         posts.map((postObj)=>{
                            return <VideoPost key={postObj.pid} postObj={postObj} ></VideoPost>
                         })
                     }
            </div>
        </>
     );
}
 
export default Feeds;