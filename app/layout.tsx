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

          <div className="w-full bg-blue-700 py-20 text-center text-white mt-4">
            <h2 className="text-3xl font-bold">Profundidades</h2>
            <p className="mt-4 text-lg">La nueva expansión está llegando!</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-6">
              <img src="/artilugio.png" alt="Carta 1" className="w-60 md:w-80 lg:w-96 max-w-xs h-auto rounded-lg" />
              <img src="/tallar.png" alt="Carta 2" className="w-60 md:w-80 lg:w-96 max-w-xs h-auto rounded-lg" />
            </div>
          </div>
          <footer className="relative bg-gradient-to-b from-blue-700 to-blue-900 text-white py-16 w-full">
            <div className="absolute bottom-0 left-0 right-0 w-full">
              <svg className="w-full h-40" viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#1a2e66"
                  fillOpacity="1"
                  d="M0,224L80,208C160,192,320,160,480,165.3C640,171,800,213,960,218.7C1120,224,1280,192,1360,176L1440,160L1440,320L0,320Z"
                ></path>
              </svg>
            </div>
            <div className="p-4 pt-0 flex justify-center">
              <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">v2</span>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
