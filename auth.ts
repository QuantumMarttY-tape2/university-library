import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "./database/drizzle";
import { users } from "./database/schema";
import { eq } from "drizzle-orm";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                // If nothing is there, return null.
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                
                // Otherwise, fetch user information. "eq" means equal here.
                // "where" user email match the one in credentials.
                // And there can only be 1 user with the same email. ("limit")
                const user = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, credentials.email.toString()))
                    .limit(1);
                    
                
                // If user doesn't exist, return null.
                if (user.length === 0) {
                    return null;
                }
                
                const isPasswordValid = await compare(credentials.password.toString(), user[0].password);

                // If the password is not valid, return null.
                if (!isPasswordValid) {
                    return null;
                }
                
                return {
                    id: user[0].id.toString(),
                    email: user[0].email,
                    name: user[0].fullName,
                } as User;
            }
        })
    ],
    pages: {
        signIn: "/sign-in",
    },
    callbacks:{
        async jwt({token, user}) {
            // If the user exists, set the token equal to the user.
            if (user) {
                token.id = user.id;
                token.name = user.name;
            }
            return token;
        },
        async session({session, token}) {
            // If a session exists, set the session equal to the token.
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
            }

            return session;
        }
    }
})