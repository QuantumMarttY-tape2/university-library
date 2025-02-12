import { auth } from "@/auth";
import Header from "@/components/Header";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { after } from "next/server";
import React, { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
    // We want redirect to the sign in page when we have not signed in.
    const session = await auth();
    if (!session) redirect("/sign-in");

    after(async () => {
        // If user does not exist, return.
        if (!session?.user?.id) return;
        
        // Update the user's last activity. We only want to update this once a day because we only need accuracy at day level.
        // Get the user to see if the last activity date is today.
        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, session?.user?.id))
            .limit(1);
        
        // If the last activity date is today, return.
        if (user[0].lastActivityDate === new Date().toISOString().slice(0,10)) return;

        // Only updates if the user is logged in.
        await db
            .update(users)
            .set({ lastActivityDate: new Date().toISOString().slice(0,10) }) // slice(0,10) means take yyyy.mm.dd
            .where(eq(users.id, session?.user?.id))
    });

    return (
        <main className="root-container">
            <div className="mx-auto max-w-7xl">
                <Header session={session}/>

                <div className="mt-20 pb-20">
                    {children}
                </div>
            </div>
        </main>
    )
}

export default Layout;