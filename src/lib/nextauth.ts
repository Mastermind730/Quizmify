import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
export const authOptions:NextAuthOptions={
    session:{
        strategy:'jwt',
    },
    callbacks:{
        
    }
    secret:process.env.NEXTAUTH_SECRET,
    adapter:PrismaAdapter(prisma),

}