import { auth } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
    // We do not want to see the sign in page when we have already signed in, so we redirect it to the homepage.
    const session = await auth();
    if (session) redirect("/");

    return (
        <main className="auth-container">
            <section className="auth-form">
                <div className="auth-box">
                    {/* Shared logo design. */}
                    <div className="flex flex-row gap-3">
                        <Image
                            src="/icons/logo.svg"
                            alt="logo"
                            width={37}
                            height={37}
                        />

                        <h1 className="text-2xl font-semibold tedxt-white">BookWise</h1>
                    </div>
                    
                    {/* Rendering different children here. */}
                    <div className="">{children}</div>
                </div>
            </section>

            {/* Shared decorative image. */}
            <section className="auth-illustration">
                <Image
                    src="/images/auth-illustration.png"
                    alt="auth illustration"
                    height={1000}
                    width={1000}
                    className="size-full object-cover"
                />
            </section>
        </main>
    )
}

export default Layout;