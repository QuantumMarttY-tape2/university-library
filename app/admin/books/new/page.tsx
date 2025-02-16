import BookForm from "@/components/admin/forms/BookForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Page = () => {
    return (
        <>
            {/* asChild means the button becomes a link. */}
            <Button asChild className="back-btn">
                <Link href="/admin/books">Go Back</Link>
            </Button>

            {/* Section for the admin to be the book god. */}
            <section className="w-full max-w-2xl">
                <BookForm />
            </section>
        </>
    );
};

export default Page;