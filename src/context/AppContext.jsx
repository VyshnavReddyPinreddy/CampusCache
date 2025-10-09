import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
import React,{useEffect} from 'react'

export const AppContent = createContext();

export const AppContextProvider = (props)=>{

    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin,setIsLoggedin] = useState(false);
    const [userData,setUserData] = useState(null);

    const getAuthState = async ()=>{
        try{
            const {data} = await axios.get(backendUrl+'/api/auth/is-auth');
            if(data.success){
                setIsLoggedin(true);
                getUserData();
            }
        }catch(error){
            // Ignore auth check errors as they're expected when not logged in
            console.log('Auth check failed:', error.message);
        }
    }

    const getUserData = async ()=>{
        try{
            const {data} = await axios.get(backendUrl+'/api/user/data');
            data.success ? setUserData(data.userData) : toast.error(data.message);
        }catch(error){
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        getAuthState();
    },[]);

    const value = {
        backendUrl, 
        isLoggedin,setIsLoggedin,
        userData,setUserData,
        getUserData
    }
    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}