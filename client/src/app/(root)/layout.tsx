import { ReactNode } from "react";
import {Toaster} from "@/components/ui/sonner";

export default function RootLayout({children}: {children: ReactNode}) {
    return (
        <main>
            {children}
            <Toaster />
        </main>
    );
}
