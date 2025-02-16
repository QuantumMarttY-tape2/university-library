"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { borrowBook } from "@/lib/actions/book";


interface Props {
    userId: string;
    bookId: string;
    borrowingEligibility: {
        isEligible: boolean;
        message: string;
    }
}
const BorrowBook = ({ userId, bookId, borrowingEligibility: { isEligible, message } }: Props) => {
    // Renavigate the user to another page after they borrow.
    const router = useRouter();

    // useState to handle the loading state of the borrowing.
    const [borrowing, setBorrowing] = useState(false);

    const handleBorrowBook = async () => {
        // If not eligible.
        if (!isEligible) {
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
        }

        setBorrowing(true);

        try {
            const result = await borrowBook({ userId, bookId });

            if (result.success) {
                toast({
                    title: "Success",
                    description: "Book borrowed successfully.",
                })

                router.push('/')
            } else {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Error borrowing book.",
                variant: "destructive",
            })
        } finally {
            // Stop loading.
            setBorrowing(false);
        }
    }
    return (
        <Button className="book-overview_btn" onClick={handleBorrowBook}>
            <Image
                src="/icons/book.svg"
                alt="book"
                width={20}
                height={20}
            />
            <p className="font-bebas-neue text-xl text-dark-100">{borrowing ? "Borrowing..." : "Borrow Book"}</p>
        </Button>
    );
};

export default BorrowBook;