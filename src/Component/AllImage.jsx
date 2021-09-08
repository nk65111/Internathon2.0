import React, { useState ,useContext ,useEffect} from 'react'
import {Button}from '@material-ui/core';

import VideoPost from './VideoPost';


import { firebaseDB} from '../Config/Firbase';
const AllImage = (props) => {

    const [posts,setposts]=useState([]);
    const [uploadVideoError,setUploadVideoError]=useState("");
    

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
                             if(postObj.postType=="Image"){
                                return <VideoPost key={postObj.pid} postObj={postObj} ></VideoPost>
                             }
                           
                         })
                     }
            </div>
        </>
     );
}
 
export default AllImage;