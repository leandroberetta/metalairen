"use client";

import "./globals.css";
import NavBar from "./components/NavBar";
import { useEffect } from "react";
import { initFlowbite } from "flowbite";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    initFlowbite();
  }, []);
  return (
    <html lang="es" className="dark">
      <head>
        <title>MetaLairen</title>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1707306639075867"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="dark:bg-gray-900 dark:text-white flex flex-col min-h-screen">
        <SessionProvider>
          <div className="container mx-auto grow">
            <NavBar />
            {children}
          </div>
          <footer 
          >
            <div className="p-4 pt-0 flex justify-center">
              <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">v2</span>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
