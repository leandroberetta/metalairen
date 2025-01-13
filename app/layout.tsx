
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
      <body className="dark:bg-gray-900 dark:text-white flex flex-col min-h-screen">
        <div className="container mx-auto grow">
          <NavBar />
          {children}
        </div>
        <div className="p-5 flex justify-center">
          <span
            className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">v2</span>
        </div>
      </body>
    </html>
  );
}
