import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

import "@/styles/admin.css";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/database/schema";

const Layout = async ({ children }: {children: ReactNode}) => {
    // Check if there are actuve sessions.
    const session = await auth();

    // If there is no active session, redirect to the sign in page.
    if (!session?.user?.id) redirect("/sign-in");

    // Check if the user is an admin.
    const isAdmin = await db
        .select({isAdmin: users.role})
        .from(users)
        .where(eq(users.id, session?.user?.id))
        .limit(1)
        .then((res) => res[0]?.isAdmin === "ADMIN");
    
    // If the user is not an admin, redirect to the home page.
    if (!isAdmin) redirect("/");

    return (
        <main className="flex min-h-screen w-full flex-row">
            <Sidebar session={session} />

            <div className="admin-container">
                <Header session={session} />

                {children}
            </div>
        </main>
    )
}

export default Layout;