import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Expense Tracker",
    description: "Track your personal finances and debts",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "BET",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#09090b",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={cn(inter.className, "antialiased bg-background min-h-screen pb-20 md:pb-0 font-sans")}>
                <div className="flex flex-col min-h-screen md:flex-row">
                    <Navigation />
                    <main className="flex-1 p-4 md:p-8 overflow-y-auto h-full">
                        <div className="max-w-4xl mx-auto w-full">
                            {children}
                        </div>
                    </main>
                </div>
            </body>
        </html>
    );
}
