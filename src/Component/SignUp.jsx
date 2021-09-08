import React, { useState, useContext } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import logo from '../logo.png';
import {Link} from 'react-router-dom';
import CloudUpload from '@material-ui/icons/CloudUpload';
import {Button,Card,CardMedia,Paper,Typography,CardContent,makeStyles,Grid,Container,CardActions,TextField} from "@material-ui/core";

import {firebaseStorage,firebaseDB} from '../Config/Firbase';
const SignUp = (props) => {
    const [username,setusername]=useState("");
    const [email,setemail]=useState("");
    const [password,setpassword]=useState("");
    const [profileimg,setprofileimg]=useState(null);
    const [message,setmessage]=useState("");
    let {signUp}=useContext(AuthContext);
    const paperStyle={padding :20,height:'70vh',width:'25%', margin:"4% auto"};

    let useStyle=makeStyles({
        fullWidth:{
            width:"100%"
        },
        alignCenter:{
            textAlign:"center",
            padding:"2%"
        },
        marginTop:{
            width:"100%",
            marginTop:"0.5rem"
        }
    });
    let classes=useStyle();
    function handleFileSubmit(e){
      let fileObject=e.target.files[0];
      setprofileimg(fileObject);
    //   console.log(fileObject);
    }
    async function handleSignUp(){
    try{
        let response=await signUp(email,password);
        let uid=response.user.uid;
        const  uploadphotoObject= firebaseStorage.ref(`/profileImage/${uid}/image.jpg`).put(profileimg);
           console.log(uploadphotoObject);
        uploadphotoObject.on("state_changed",fun1,fun2,fun3);
        function fun1(snapshot){
            let progress=(snapshot.bytesTransferred/snapshot.TotalBytes)*100;
            console.log(progress);
        }
        function fun2(err){
            console.log(err);
        }
        async function fun3(){
            let profileUrl= await uploadphotoObject.snapshot.ref.getDownloadURL();
            await firebaseDB.collection("users").doc(uid).set({
                email:email,
                username:username,
                profileUrl:profileUrl,
                userid:uid,
                postCreated:[]
            });
            props.history.push("/");
        }
     }catch(err){
         setmessage(err.message);
     }
    }
    return ( 
        <>
        
            <Container  elevation={10} style={paperStyle}>
                  <Card>
                    <CardMedia image={logo} style={{ height: "5rem", backgroundSize: "contain" }}></CardMedia>
                    <Typography>
                        Sign up to see photo and video of your freinds
                    </Typography>
                    <CardContent>
                        <TextField className={classes.marginTop} label="username" value={username} onChange={ (e)=>{setusername(e.target.value)}} variant="outlined" size="small"></TextField>
                        <TextField className={classes.marginTop} label="email" value={email} onChange={ (e)=>{setemail(e.target.value)}} variant="outlined" size="small"></TextField>
                        <TextField className={classes.marginTop} label="password" value={password} onChange={ (e)=>{setpassword(e.target.value)}} variant="outlined" size="small"></TextField>
                    </CardContent>
                    <CardActions>
                       <Button className={classes.fullWidth}  startIcon={<CloudUpload></CloudUpload>} variant="contained" color="secondary" component="label" style={{margin:"5px"}}>Upload Profile Photo<input  type="file" accept="image/*"  onChange={(e) => { handleFileSubmit(e);}} hidden/></Button>
                    </CardActions>
                    <CardActions>
                        <Button className={classes.fullWidth} onClick={handleSignUp} variant="contained" color="primary">SIGN UP</Button>
                    </CardActions>

                    <Typography className={classes.alignCenter} >
                        By Signing up, you agree to our terms ,Data Policy and Cookies Policy
                    </Typography>

                    </Card>
                    <Card variant="outlined">
                   <Typography  className={classes.alignCenter}>
                    have an account ?
                   <Link to='/login'>
                   Log in</Link>
                    </Typography>
                   </Card>
                
            </Container>
        </>
    );
}
 
export default SignUp;