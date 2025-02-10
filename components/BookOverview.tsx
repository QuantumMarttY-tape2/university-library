import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import BookCover from "./BookCover";

const BookOverview = ({
    title,
    author,
    genre,
    rating,
    totalCopies,
    availableCopies,
    description,
    coverColor,
    coverUrl
}: Book) => {
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
                <Button className="book-overview_btn">
                    <Image
                        src="/icons/book.svg"
                        alt="book"
                        width={20}
                        height={20}
                    />
                    <p className="font-bebas-neue text-xl text-dark-100">Borrow</p>
                </Button>
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