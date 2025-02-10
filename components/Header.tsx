'use client'

import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Session } from "next-auth";

const Header = ({ session }: { session: Session }) => {
    // We want to highlight the current page on the navbar by changing it to the primary color.
    // This "usePathname" hook requires 'use client' at the top.
    const pathname = usePathname();

    return (
        <header className="my-10 flex justify-between gap-5">
            {/* Link to go back to homepage. */}
            <Link href="/">
                <Image
                    src="/icons/logo.svg"
                    alt="logo"
                    width={40}
                    height={40}
                />
            </Link>

            {/* Navigation links. */}
            <ul className="flex flex-row items-center gap-8">
                <li>
                    <Link href="/library" className={cn('text-base cursor-pointer capitalize', pathname === '/library' ? 'text-light-200' : 'text-light-100')}>
                        Library
                    </Link>
                </li>

                {/* User profile. */}
                <li>
                    <Link href="/my-profile">
                        <Avatar>
                            <AvatarFallback className="bg-amber-100 text-black">
                                {getInitials(session?.user?.name || 'IN')}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                </li>
            </ul>
        </header>
    );
};

export default Header;