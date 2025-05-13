import type { Metadata } from "next";
import "./globals.css";
import { Lato, Open_Sans } from 'next/font/google';
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/subscribers/navbar/Navbar";
import Footer from "@/components/subscribers/footer/Footer";


const lato = Lato({ 
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
  weight: ['400', '700', '900'],
});

const openSans = Open_Sans({ 
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
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
      <body className="bg-gray-200 min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <Navbar/>
        {children}
      <Footer/>
      </body>
    </html>
  );
}
