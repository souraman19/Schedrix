'use client';

import React from 'react';
import { useEffect } from 'react';
import {generateToken} from "@/notifications/firebase";
import { messaging } from '@/notifications/firebase';
import { onMessage } from 'firebase/messaging'; 

export default function TokenGenerator() {
    useEffect(() => {
        generateToken();
        onMessage(messaging, (payload)=> {
            console.log('Message received. ', payload);
        })
    }, [])


    return (<>
    </>);
}