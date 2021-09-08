import React, { useState, useEffect,useContext } from 'react';
import {AuthContext} from "../Context/AuthProvider"
import {Link} from "react-router-dom";
import { AppBar, Toolbar ,Button,CardMedia} from "@material-ui/core";
import logo from "../logo.png";
const Header = (props) => {
    let {signOut}=useContext(AuthContext);
    async function handleLogOut(e){
        try{
            signOut();
            props.history.push("/login");
        }catch(err){
        }
    }
    const displayDesktop = () => {
        return( <Toolbar>
            <Link onClick={handleLogOut} variant="contained" color="primary"  style={{marginLeft:"2%", color:"white"}}>Logout</Link>
            <Link to="/video" variant="contained" color="primary" style={{marginLeft:"2%" ,color:"white"}} >Video</Link>
            <Link to="/image"  variant="contained" color="primary" style={{marginLeft:"2%" ,color:"white"}} >Image</Link>
            <Link to="/profile" variant="contained" color="primary" style={{marginLeft:"2%" ,color:"white"}} >Profile</Link>
            
        </Toolbar>
      )};
      
      return (
        <header>
          <AppBar>{displayDesktop()}</AppBar>
        </header>
      );
}
 
export default Header;