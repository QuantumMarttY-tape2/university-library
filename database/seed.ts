import ImageKit from "imagekit";
import dummyBooks from "../dummybooks.json";
import { books } from "./schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";

// Setup config.
config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql });

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
})

const uploadToImagekit = async (url: string, fileName: string, folder: string) => {
    try {
        const response = await imagekit.upload({
            file: url,
            fileName,
            folder,
        });

        return response.filePath;
        
    } catch (error) {
        console.error("Error uploading image to ImageKit:", error);
    }
}

const seed = async () => {
    console.log("Seeding data...")

    try {
        // Loop over the seed data.
        for (const book of dummyBooks) {
            // Upload cover images and cover videos to imagekit.
            const coverUrl = await uploadToImagekit(book.coverUrl, `${book.title}.jpg`, "/books/covers") as string;
            const videoUrl = await uploadToImagekit(book.videoUrl, `${book.title}.mp4`, "/books/videos") as string;

            // Insert the above into the database.
            await db.insert(books).values({
                ...book,
                coverUrl,
                videoUrl,
            })
        }

        console.log("Data seeded successfully.");
    } catch (error) {
        console.error("Error seeding data:", error);
    }
}

seed();