
import React, { useState, useEffect } from 'react';
import {firebaseAuth} from '../Config/Firbase';

export const AuthContext=React.createContext();

export const AuthProvider=({children})=>{
    const [currentUser,setCurUser] = useState(null);

    function login(email,password){
        return firebaseAuth.signInWithEmailAndPassword(email,password);
    }
    function signOut(){
        return firebaseAuth.signOut();
    }

    function signUp(email,password){
        return firebaseAuth.createUserWithEmailAndPassword(email,password);
    }

    useEffect(()=>{
        firebaseAuth.onAuthStateChanged((user)=>{
            console.log("Change the user",user);
           setCurUser(user);
        })
    },[]);

    let value={
        currentUser:currentUser,
        login:login,
        signOut:signOut,
        signUp:signUp,
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}