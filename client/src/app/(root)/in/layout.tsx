import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({children}: {children: ReactNode}) {
    return (
        <main>
            <div className="flex">
          <Sidebar />
          <main className="flex-1">
            {children}
          </main>
        </div>
        </main>
    );
}
