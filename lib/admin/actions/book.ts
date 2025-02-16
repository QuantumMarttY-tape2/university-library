// Server actions.
"use server";

import { db } from "@/database/drizzle";
import { books } from "@/database/schema";

// Book creation.
export const createBook = async (params: BookParams) => {
    try {
        const newBook = await db.insert(books).values({
            ...params,
            availableCopies: params.totalCopies,
        }).returning();
        // returning() means we want to get the value back when we just created in the database.

        return {
            success: true,
            data: JSON.parse(JSON.stringify(newBook[0])),
        }
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: "Error creating book."
        }
    }
}