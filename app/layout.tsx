
"use client";

import "./globals.css";
import NavBar from "./components/NavBar";
import { useEffect } from "react";
import { initFlowbite } from "flowbite";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <html className="dark">
      <body className="dark:bg-gray-900 dark:text-white">
        <NavBar />     
        {children}   
      </body>
    </html>
  );
}
