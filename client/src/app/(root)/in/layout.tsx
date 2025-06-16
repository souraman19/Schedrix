import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import TokenGenerator from "@/lib/TokenGenerator";

export default function RootLayout({children}: {children: ReactNode}) {
    return (
        <main>
          <div className="flex">
          <TokenGenerator />
          <Navbar />
          <main className="flex-1 mt-20">
            {children}
          </main>
        </div>
        </main>
    );
}
