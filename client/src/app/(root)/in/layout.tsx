import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

export default function RootLayout({children}: {children: ReactNode}) {
    return (
        <main>
            <div className="flex">
          <Navbar />
          <main className="flex-1 mt-20">
            {children}
          </main>
        </div>
        </main>
    );
}
