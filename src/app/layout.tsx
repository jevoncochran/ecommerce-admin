"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProvider from "./SessionProvider";
import Nav from "@/components/nav";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const page = usePathname();
  const isHomePage = page === "/";

  return (
    <html lang="en">
      <body className="bg-blue-900 min-h-screen flex">
        <SessionProvider>
          {!isHomePage && <Nav />}
          {!isHomePage ? (
            <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
              {children}
            </div>
          ) : (
            children
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
