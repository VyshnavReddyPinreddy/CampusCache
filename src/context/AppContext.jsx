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
    const [isLoading, setIsLoading] = useState(true);

    const getAuthState = async ()=>{
        setIsLoading(true);
        try{
            const {data} = await axios.get(backendUrl+'/api/auth/is-auth');
            if(data.success){
                setIsLoggedin(true);
                await getUserData(); // Wait for user data
            }
        }catch(error){
            // Only log auth check errors
            console.log('Auth check failed:', error.message);
            setIsLoggedin(false);
            setUserData(null);
        } finally {
            setIsLoading(false);
        }
    }

    const getUserData = async ()=>{
        try{
            const {data} = await axios.get(backendUrl+'/api/user/data');
            if (data.success) {
                setUserData(data.userData);
            } else {
                setUserData(null);
                setIsLoggedin(false);
                toast.error(data.message);
            }
        }catch(error){
            setUserData(null);
            setIsLoggedin(false);
            if (error.response?.status === 401) {
                // Don't show error for auth failures
                console.log('Auth failed:', error.message);
            } else {
                toast.error(error.message);
            }
        }
    }

    useEffect(()=>{
        getAuthState();
    },[]);

    const value = {
        backendUrl, 
        isLoggedin,setIsLoggedin,
        userData,setUserData,
        getUserData,
        isLoading
    }
    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}