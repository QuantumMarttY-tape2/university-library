import React from "react";
import BookCard from "./BookCard";

interface Props {
    title: string;
    books: Book[];
    containerClassName?: string;
}

const BookList = ({ title, books, containerClassName }: Props) => {
    return (
        <section className={containerClassName}>
            {/* Render title. */}
            <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>

            {/* Render books. */}
            <ul className="book-list">
                {books.map((book) => (
                    <BookCard key={book.title} {...book} />
                ))}
            </ul>
        </section>
    );
};

export default BookList;