import React ,{useState,useEffect,useContext}from 'react'
import { firebaseDB } from '../Config/Firbase';
import {Container,Card,Typography,TextField,Button,Avatar,CardMedia} from '@material-ui/core';
import {Favorite,FavoriteBorder} from '@material-ui/icons';
import {AuthContext} from "../Context/AuthProvider"
const VideoPost = (props) => {
    const [user,setuser]=useState(null);
    const [comment,setcomment]=useState("");
    const [commentList,setcommentList]=useState([]);

    const [countLike,setcountLike]=useState(null);
    const [isLike,setisLike]=useState(false);
    let {currentUser}=useContext(AuthContext);
    
    const toggleLike= async ()=>{
        if(isLike){
            let postObj=props.postObj;
            let newLikesList=postObj.likes.filter(uid=>{
                if(uid==currentUser.uid){
                    return false;
                }else{
                    return true;
                }
            })
            postObj.likes=newLikesList;
            await firebaseDB.collection("posts").doc(postObj.pid).set(postObj);
            setisLike(false);
            countLike==1?setcountLike(null):setcountLike(countLike-1);
        }else{
            let postObj=props.postObj;
            postObj.likes.push(currentUser.uid);
            await firebaseDB.collection("posts").doc(postObj.pid).set(postObj);
           setisLike(true);
           countLike==null?setcountLike(1):setcountLike(countLike+1);
        }
    }

    const addCommentList=async ()=>{
       let profilePic;
       if(currentUser.uid==user.userid){
           profilePic=user.profileUrl;
       }else{
           let doc=await firebaseDB.collection("users").doc(currentUser.uid).get();
           let user=doc.data();
           profilePic=user.profileUrl;
       }
       let newcommentList=[...commentList,{profilePic:profilePic,comment:comment}];
       let postObj=props.postObj;
       postObj.comment.push({uid:currentUser.uid,comment:comment});
       await firebaseDB.collection("posts").doc(postObj.pid).set(postObj);
      
       setcommentList(newcommentList);
       setcomment("");
    }

    useEffect( async ()=>{
      let uid=props.postObj.uid;
      let doc=await firebaseDB.collection("users").doc(uid).get();
      let user=doc.data();
      let likes=props.postObj.likes;
      let commentList=props.postObj.comment;
      let userCommentList=[];
      for(let i=0;i<commentList.length;i++){
          let commentObj=commentList[i];
          let doc=await firebaseDB.collection("users").doc(commentObj.uid).get();
          let userPhotoLink=doc.data().profileUrl;
          userCommentList.push({profilePic:userPhotoLink,comment:commentObj.comment});
      }

      if(likes.includes(currentUser.uid)){
          setisLike(true);
          setcountLike(likes.length);
      }else{
          if(likes.length){
             setcountLike(likes.length);
          }
      }
      setuser(user);
      setcommentList(userCommentList);   
    },[]);
    return (
        <Container >
            <Card style={{width: "300px", margin: "auto", padding: "10px", marginBottom: "20px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignContent:"center",margin:"8px"}}>
                    <div style={{display:"flex" ,alignContent:"center",justifyContent:"center"}}>
                        <Avatar src={user?user.profileUrl:""}></Avatar>
                        <Typography variant="span" >{user?user.username:""}</Typography>
                    </div>
                   
                    <Button variant="contained" color="secondary" >Location</Button>
                </div>
                
                <div className="video-conatiner">
                {
                    props.postObj.postType=="Image"?(
                        <CardMedia image={props.postObj.VideoLink} style={{ height: "20rem",backgroundSize: "contain"}} className="image"></CardMedia>
                    ):( <Video  src={props.postObj.VideoLink} style={{ height: "50%",}} ></Video>)
                }
                
                
                </div>
                <div>
                    {isLike?<Favorite style={{color:"red"}} onClick={()=>toggleLike()}></Favorite>:<FavoriteBorder onClick={()=>toggleLike()} ></FavoriteBorder>}
                </div>
                {
                    countLike&&(<div>
                        <Typography variant="p">Liked by {countLike} others</Typography>
                    </div>)
                }
                <Typography variant="p">Comments</Typography>
                <TextField variant="outlined" label="add a comment" size="small" value={comment} onChange={(e)=>{setcomment(e.target.value)}}></TextField>
                <Button variant="contained" color="secondary" onClick={addCommentList}>Post</Button>
                {
                    commentList.map((commentObj)=>{
                       return(
                        <>
                            <Avatar src={commentObj.profilePic}></Avatar>
                            <Typography variant="p">{commentObj.comment}</Typography>
                       </>
                       )
                    })
                }
            </Card> 
        </Container>
    );
}
 

function Video(props){
    return(
        <video  style={{
            height: "100%",
            width:"100%"
          }} controls  muted={true} loop={true}>
            <source src={props.src} type="video/mp4"></source>
        </video>
    )
}

export default VideoPost;