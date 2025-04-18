"use client";

import React from "react";  
import axios from 'axios';
import { useEffect } from 'react';
import {useRouter} from 'next/navigation';
import { useUserStore } from "@/store/useUserStore";


export default function HomePage() {
  
    const {setUser, user} = useUserStore(); // Get the Zustand store state
    const router = useRouter();

    useEffect(() => {
        const fetchUserInfo = async () => {
          try {
            const response = await axios.get('http://localhost:5000/auth/user', {
            withCredentials: true});
            console.log('User info:', response.data);
            setUser(response.data); // Set the user info in the Zustand store
        } catch (error : any) {
            if (error.response && error.response.status === 401) {
                console.log('User not authenticated');
                router.push('/'); // Redirect to the login page
              } else {
                console.error('Error fetching user data:', error);
                // Handle other errors as needed
              }
          }
        };
        fetchUserInfo();
    }, [])

    useEffect(() => {
      console.log('User state changed:', user);
    }, [user])


    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome to Schedrix</h1>
            <p className="text-lg mb-8">Your smart task manager for life & work.</p>
            <a href="/login" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300">Get Started</a>
        </div>
    );
}