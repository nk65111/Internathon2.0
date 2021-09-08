import React, { useState ,useContext ,useEffect} from 'react'
import {Button}from '@material-ui/core';

import VideoPost from './VideoPost';



import { firebaseDB, firebaseStorage ,timeStamp} from '../Config/Firbase';

const AllVideo = (props) => {

    const [posts,setposts]=useState([]);
    const [uploadVideoError,setUploadVideoError]=useState("");

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

    function handleOnMaiPage(){
        props.history.push("/");
    }

    return ( 
        <>  
        <div>
            <Button onClick={handleOnMaiPage} variant="contained" color="secondary" style={{marginTop:"5%"}}>Main Page</Button>
        </div>
            <p>{uploadVideoError}</p>
            <div className="video-list"  style={{ margin: "auto" }}>
                     {
                         posts.map((postObj)=>{
                             if(postObj.postType=="Reels"){
                                return <VideoPost key={postObj.pid} postObj={postObj} ></VideoPost>
                             }
                           
                         })
                     }
            </div>
        </>
     );
}
 
export default AllVideo;