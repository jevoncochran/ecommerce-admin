"use client";

import { useState } from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import SessionProvider from "./SessionProvider";
import Nav from "@/components/nav";
import { usePathname } from "next/navigation";
import { MobileNavContext } from "@/context/mobile-nav-context";
import Logo from "@/components/logo";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const page = usePathname();
  const isHomePage = page === "/";

  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <html lang="en">
      <MobileNavContext.Provider value={{ showMobileNav, setShowMobileNav }}>
        <body className="bg-gray-200 min-h-screen">
          <SessionProvider>
            <div className="flex items-center p-2 md:hidden">
              <button onClick={() => setShowMobileNav(true)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
              <div className="w-full fixed left-6 flex justify-center">
                <Logo />
              </div>
            </div>
            <div className="md:flex">
              {!isHomePage && <Nav />}
              {!isHomePage ? (
                <div className="bg-white flex-grow p-4 min-h-screen">
                  {children}
                </div>
              ) : (
                children
              )}
            </div>
          </SessionProvider>
        </body>
      </MobileNavContext.Provider>
    </html>
  );
}
