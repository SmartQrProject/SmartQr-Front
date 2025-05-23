import type { Metadata } from "next";
import "./globals.css";
import { Lato, Open_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AdminLoginProvider } from "./(admin)/login/adminLoginContext";
import ChatBot from "@/components/chatbot/ChatBot";
import Script from 'next/script';
import Footer from "@/components/subscribers/footer/Footer";

import { SpeedInsights } from "@vercel/speed-insights/next"

const lato = Lato({
    subsets: ["latin"],
    variable: "--font-lato",
    display: "swap",
    weight: ["400", "700", "900"],
});

const openSans = Open_Sans({
    subsets: ["latin"],
    variable: "--font-open-sans",
    display: "swap",
});

export const metadata: Metadata = {
    title: "SmartQR",
    description: "SmartQR is a self-ordering menu system using QR codes and modern tech to help restaurants improve service, efficiency, and sales.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${lato.variable} ${openSans.variable}`}>
            <head>
                <Script
                src="https://widget.cloudinary.com/v2.0/global/all.js"
                strategy="beforeInteractive"
                async
                />
            </head>
            <body className=" min-h-screen flex flex-col">
                
                <Toaster position="top-center" />
                <AdminLoginProvider>
                <main className="flex-1">
                    {children}
                    <SpeedInsights />
                </main>
                <ChatBot />
                </AdminLoginProvider>
            
            </body>
        </html>
    );
}
