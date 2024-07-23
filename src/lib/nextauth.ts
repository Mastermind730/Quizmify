import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prismadb";
import GoogleProvider from "next-auth/providers/google";

// Extend Session and JWT interfaces
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
    } & DefaultSession['user'];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email?: string;
    name?: string;
    picture?: string;
  }
}


// Configure NextAuth options
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token }) {
      try {
        if (token?.email) {
          const dbUser = await prisma.user.findFirst({
            where: {
              email: token.email,
            },
          });
          if (dbUser) {
            // console.log(dbUser);
            token.id = dbUser.id;
            token.name = dbUser.name; // Example: Fetch additional user details
            token.picture = dbUser.image ? dbUser.image : ''; ; // Example: Fetch additional user details
          }
        }
      } catch (error) {
        console.error("Error in jwt callback:", error);
      }
      return token;
    },
    async session({ session, token }) {
      try {
        if (token) {
          // console.log(token)
          session.user.id = token.id;
          session.user.name = token.name;
          session.user.email = token.email;
          session.user.image = token.picture;
        }
      } catch (error) {
        console.error("Error in session callback:", error);
      }
      return session;
    },
  },
  
  secret: process.env.NEXT_AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // Add other providers here if needed
  ],
};

// Function to get authentication session
export const getAuthSession = () => {
  return getServerSession(authOptions);
};
