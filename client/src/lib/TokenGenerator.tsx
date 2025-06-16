'use client';

import React from 'react';
import { useEffect } from 'react';
import {generateToken} from "@/notifications/firebase";
import { messaging } from '@/notifications/firebase';
import { onMessage } from 'firebase/messaging'; 
import toast, { Toaster } from 'react-hot-toast';

export default function TokenGenerator() {
    useEffect(() => {
        generateToken();
        onMessage(messaging, (payload)=> {
            toast(payload.notification!.title!);
        })
    }, [])


    return (<>
    </>);
}