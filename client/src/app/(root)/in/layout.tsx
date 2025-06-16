import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import TokenGenerator from "@/lib/TokenGenerator";
import toast, { Toaster } from 'react-hot-toast';  //2nd toast notification`library

export default function RootLayout({children}: {children: ReactNode}) {
    return (
        <main>
          <div className="flex">
          <Toaster 
            position="top-right"
            reverseOrder={false}
          /> {/* for react hot toast library */}

          <TokenGenerator />
          <Navbar />
          <main className="flex-1 mt-20">
            {children}
          </main>
        </div>
        </main>
    );
}
