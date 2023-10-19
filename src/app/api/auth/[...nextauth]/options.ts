import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// Import the MongoDB adapter and the clientPromise
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  // Add the adapter to the Next Auth options and pass in the client promise
  adapter: MongoDBAdapter(clientPromise),
  // Must set session strategy to "jwt" for middleware to work with MongoDB adapter
  // When MongoDB adapter is used, session strategy defaults to "database"
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token.sub;
      }
      return session;
    },
  },
};
