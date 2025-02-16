"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";

export const borrowBook = async (params: BorrowBookParams) => {
    const { userId, bookId } = params;

    try {
        const book = await db
            .select({ availableCopies: books.availableCopies })
            .from(books)
            .where(eq(books.id, bookId))
            .limit(1);

        // If the book does not exist.
        if (!book.length || book[0].availableCopies <= 0) {
            return {
                success: false,
                message: "Book is not currently available."
            }
        }

        // Deadline.
        const dueDate = dayjs().add(7, "days").toDate().toDateString();

        // New borrowing record.
        const record = await db.insert(borrowRecords).values({
            userId,
            bookId,
            dueDate,
            status: "BORROWED"
        });

        // Update available copies.
        await db
            .update(books)
            .set({ availableCopies: book[0].availableCopies - 1 })
            .where(eq(books.id, bookId));

        return {
            success: true,
            data: JSON.parse(JSON.stringify(record)),
        }
    } catch (error) {
        console.log(error);

        return {
            success: false,
            error: "Error borrowing book."
        }
    }
}