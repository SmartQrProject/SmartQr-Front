import type { Metadata } from "next";
import "./globals.css";



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
    <html lang="en">
      <body
       
      >
        {children}
      </body>
    </html>
  );
}
