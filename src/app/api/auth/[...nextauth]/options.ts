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
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async session({ session, token, user }) {
      session.user._id = user.id;
      return session;
    },
  },
};
