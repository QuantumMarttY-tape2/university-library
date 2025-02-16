import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import BookCover from "./BookCover";
import BorrowBook from "./BorrowBook";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

interface Props extends Book {
    userId: string;
}
const BookOverview = async ({
    title,
    author,
    genre,
    rating,
    totalCopies,
    availableCopies,
    description,
    coverColor,
    coverUrl,
    id,
    userId,
}: Props) => {
    // Get user data.
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    // If user does not exist, do not borrow.
    if (!user) return null;

    const borrowingEligibility = {
        isEligible: availableCopies > 0 && user.status == "APPROVED",
        message: availableCopies < 0 ? "Book is not available" : "You are not eligible to borrow this book.",
    }
    return (
        <section className="book-overview">
            <div className="flex flex-1 flex-col gap-5">
                {/* Book Title. */}
                <h1>{title}</h1>

                {/* Book Information. */}
                <div className="book-info">
                    {/* Book Author. */}
                    <p>
                        By <span className="font-semibold text-light-200">{author}</span>
                    </p>

                    {/* Book Genre. */}
                    <p>
                        Category {" "}
                        <span className="font-semibold text-light-200">{genre}</span>
                    </p>

                    {/* Book Rating. */}
                    <div className="flex flex-row gap-1">
                        <Image
                            src="/icons/star.svg"
                            alt="star"
                            width={22}
                            height={22}
                        />
                        <p>{rating}</p>
                    </div>
                </div>

                {/* Book Copies. */}
                <div className="book-copies">
                    <p>
                        Total Books: <span>{totalCopies}</span>
                    </p>

                    <p>
                        Avaliable Books: <span>{availableCopies}</span>
                    </p>
                </div>

                {/* Book Description. */}
                <p className="book-description">{description}</p>

                {/* Borrow Book Button. */}
                <BorrowBook userId={userId} bookId={id} borrowingEligibility={borrowingEligibility} />
            </div>

            {/* Book Cover. */}
            <div className="relative flex flex-1 justify-center">
                <div className="relative">
                    {/* Main Image. */}
                    <BookCover
                        variant="wide"
                        className="z-10"
                        coverColor={coverColor}
                        coverImage={coverUrl}
                    />

                    {/* Background Blurred Image. */}
                    <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
                        <BookCover
                            variant="wide"
                            coverColor={coverColor}
                            coverImage={coverUrl}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookOverview;