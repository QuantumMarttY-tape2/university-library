// Only be called on the server side.
"use server";

import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "../workflow";
import config from "@/lib/config";

// Only pickk email and password from AuthCredentials.
export const signInWithCredentials = async (params: Pick<AuthCredentials, "email" | "password">) => {
    const { email, password } = params;

    // Get current ip address.
    const ip = (await headers()).get('x-forwarded-for') || "127.0.0.1";
    // Ratelimit for ddox protection.
    const { success } = await ratelimit.limit(ip);
    // If not success, redirect to a "too-fast" page.
    if (!success) return redirect("/too-fast");

    try {
        const result = await signIn("credentials", {
            email, password, redirect: false,
        })

        // If error exists, return it.
        if (result?.error) {
            return { success: false, error: result.error };
        }

        return { success: true };
    } catch (error) {
        console.log(error, "Signup error");
        return { success: false, error: "Signup error." };
    }
}

export const signUp = async (params: AuthCredentials) => {
    const {fullName, email, password, universityId, universityCard} = params;

    // Get current ip address.
    const ip = (await headers()).get('x-forwarded-for') || "127.0.0.1";
    // Ratelimit for ddox protection.
    const { success } = await ratelimit.limit(ip);
    // If not success, redirect to a "too-fast" page.
    if (!success) return redirect("/too-fast");

    // Fetch existing users, if one is created already.
    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
    
    // If user already exists, return a message.
    if (existingUser.length > 0) {
        return { success: false, error: "User already exists"};
    }

    // Otherwise, we can hash the user's password.
    // The second option is the salt, which is the complexity of the hash.
    const hashedPassword = await hash(password, 10);

    try {
        // Create a new user.
        await db.insert(users).values({
            fullName,
            email,
            password: hashedPassword,
            universityId,
            universityCard
        });

        // Trigger the upstash Workflow as soon as a user is created in the database.
        await workflowClient.trigger({
            url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
            body:{
                email,
                fullName,
            }
        })

        // Sign the user in.
        await signInWithCredentials({ email, password });

        return { success: true };
    } catch (error) {
        console.log(error, "Signup error");
        return { success: false, error: "Signup error." };
    }
}
