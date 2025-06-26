'use client';

import { ReactNode } from "react";
import {Toaster} from "@/components/ui/sonner";
import Footer from "@/components/ui/Footer";

export default function RootLayout({children}: {children: ReactNode}) {
    return (
        <main>
            {children}
            <Toaster />
            <Footer />
        </main>
    );
}
