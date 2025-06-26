"use client";

import React, { useCallback } from "react";  
import axios from 'axios';
import { useEffect } from 'react';
import {useRouter} from 'next/navigation';
import { useUserStore } from "@/store/useUserStore";
import { LOG_OUT_ROUTE, USER_INFO_ROUTE } from "@/lib/apiRoutes";
import { Button } from "@mui/material";


export default function HomePage() {
  
    const {setUser, user} = useUserStore(); // Get the Zustand store state
    const router = useRouter();

    const fetchUserInfo = useCallback(async () => {
      try {
        const response = await axios.get(`${USER_INFO_ROUTE}`, {
        withCredentials: true});
        // console.log('User data:', response.data);
        setUser(response.data); // Set the user info in the Zustand store
    } catch (error : any) {
        if (error.response && error.response.status === 401) {
            console.log('User not authenticated');
            router.push('/'); // Redirect to the login page
          } else {  
            console.error('Error fetching user data:', error);
          }
      }
    }, [setUser, router]);


    useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo])

    useEffect(() => {
      // console.log('User state changed:', user);
    }, [user])

    const handleLogout = async() => {
      try{
        await axios.get(`${LOG_OUT_ROUTE}`, {
          withCredentials: true});
        setUser(null);
        router.push('/'); 
      } catch(error){
        console.error('Error logging out:', error);
      }
    }

    return(
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to Schedrix</h1>
      <p className="text-lg mb-8">Your smart task manager for life & work.</p>
      {user && (
                <Button
                    onClick={handleLogout}
                    sx={{
                      background: "linear-gradient(to right, #f44336, #e57373)", // Red gradient
                      color: "#fff",
                      borderRadius: "999px",
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "1rem",
                      "&:hover": {
                        background: "linear-gradient(to right, #e53935, #f8bbd0)", // Lighter red on hover
                        boxShadow: "0 0 16px #f4433688", // Red shadow on hover
                      },
                    }}
                >
                    Logout
                </Button>
            )}
    </div>

    );
}