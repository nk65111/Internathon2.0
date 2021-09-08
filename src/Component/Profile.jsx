import React, { useState, useContext,useEffect } from 'react'
import {firebaseDB} from "../Config/Firbase";
import {AuthContext} from "../Context/AuthProvider";
import {Avatar} from "@material-ui/core";


const Profile = () => {
    const [profilePic,setProfilePic]=useState(null);
    const [username,setusername]=useState("");
    let {currentUser}=useContext(AuthContext);
    useEffect( async() => {
        let doc=await firebaseDB.collection("users").doc(currentUser.uid).get();
        let user=doc.data();
        setProfilePic(user.profileUrl);
        setusername(user.username);
    }, [])
    return ( 
        <>
          {
              <div>
                <Avatar src={profilePic+""} size="large"></Avatar>
              </div>
              
          }
        </>
     );
}
 
export default Profile;