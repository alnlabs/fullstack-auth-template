import NextAuth from "next-auth";
import { firebaseAuthProvider } from "@/lib/firebase-auth-provider";

const handler = NextAuth(firebaseAuthProvider);

export { handler as GET, handler as POST };
