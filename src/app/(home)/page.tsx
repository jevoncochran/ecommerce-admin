"use client";

import Nav from "@/components/nav";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      {/* I did not want to show nav when user is not logged in */}
      {/* However, cannot use session in the root layout component */}
      {/* My solution was to not render Nav component from root layout when on home page */}
      {/* and to import and render it separately here only when user is logged in */}
      <Nav />
      <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4 flex justify-between">
        <div>
          <h2 className="text-blue-900">
            Hello, <b>{session?.user?.name}</b>
          </h2>
        </div>
        <div>
          <Image
            src={session?.user?.image ?? ""}
            alt={session?.user?.name ?? ""}
            width={70}
            height={70}
            className="rounded-full"
          />
        </div>
      </div>
    </>
  );
}
