// Enable form.
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import React from "react";
import { z } from "zod";

// Form Builder.
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import { bookSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import ColorPicker from "../ColorPicker";
import { createBook } from "@/lib/admin/actions/book";
import { toast } from "@/hooks/use-toast";

// "T" here means generic: we can pass any type of schema and defaultValues.
interface Props extends Partial<Book> {
    type?: "create" | "update";
}

const BookForm = ({ type, ...book }: Props) => {
    const router = useRouter();

    // Define your form.
    const form = useForm<z.infer<typeof bookSchema>>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            title: "",
            description: "",
            author: "",
            genre: "",
            rating: 1,
            totalCopies: 1,
            coverUrl: "",
            coverColor: "",
            videoUrl: "",
            summary: "",
        },
    });
    
    // Submit function.
    // This typeof thing means we simply get the values of the fields of the form.
    const onSubmit = async (values: z.infer<typeof bookSchema>) => {
        const result = await createBook(values);

        if (result.success) {
            toast({
                title: "Success",
                description: "You have successfully created a book.",
            });

            router.push(`/admin/books/${result.data.id}`);
        } else {
            toast({
                title: "Error creating book.",
                description: result.message,
                variant: "destructive",
            });
        }
    };
    
    return (
        // Main Form.
        <Form {...form}>
            {/* We spread each form segment one by one. */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Title. */}
                <FormField
                    control={form.control}
                    name={"title"}
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Book Title
                            </FormLabel>

                            <FormControl>
                                <Input
                                    required
                                    placeholder="Book Title"
                                    {...field}
                                    className="book-form_input"
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Author */}
                <FormField
                    control={form.control}
                    name={"author"}
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Author
                            </FormLabel>

                            <FormControl>
                                <Input
                                    required
                                    placeholder="Book Author"
                                    {...field}
                                    className="book-form_input"
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Genre. */}
                <FormField
                    control={form.control}
                    name={"genre"}
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Genre
                            </FormLabel>

                            <FormControl>
                                <Input
                                    required
                                    placeholder="Book Genre"
                                    {...field}
                                    className="book-form_input"
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Rating. */}
                <FormField
                    control={form.control}
                    name={"rating"}
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Rating
                            </FormLabel>

                            <FormControl>
                                <Input
                                    type="number"
                                    min={1}
                                    max={5}
                                    placeholder="Book Rating"
                                    {...field}
                                    className="book-form_input"
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Total Copies. */}
                <FormField
                    control={form.control}
                    name={"totalCopies"}
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Total Copies
                            </FormLabel>

                            <FormControl>
                                <Input
                                    type="number"
                                    min={1}
                                    max={10000}
                                    placeholder="Total Copies"
                                    {...field}
                                    className="book-form_input"
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Cover Url. */}
                <FormField
                    control={form.control}
                    name={"coverUrl"}
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Book Image
                            </FormLabel>

                            <FormControl>
                                <FileUpload
                                    type="image"
                                    accept="image/*"
                                    placeholder="Upload a book cover"
                                    folder="books/covers"
                                    variant="light"
                                    onFileChange={field.onChange}
                                    value={field.value}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Cover Color. */}
                <FormField
                    control={form.control}
                    name={"coverColor"}
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Primary Color
                            </FormLabel>

                            <FormControl>
                                <ColorPicker
                                    onPickerChange={field.onChange}
                                    value={field.value}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Description. */}
                <FormField
                    control={form.control}
                    name={"description"}
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Book Description
                            </FormLabel>

                            <FormControl>
                                <Textarea
                                    placeholder="Book Description"
                                    {...field}
                                    rows={10}
                                    className="book-form_input"
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                {/* Video Url. */}
                <FormField
                    control={form.control}
                    name={"videoUrl"}
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Book Trailer
                            </FormLabel>

                            <FormControl>
                                <FileUpload
                                    type="video"
                                    accept="video/*"
                                    placeholder="Upload a book trailer"
                                    folder="books/videos"
                                    variant="light"
                                    onFileChange={field.onChange}
                                    value={field.value}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Book Summary. */}
                <FormField
                    control={form.control}
                    name={"summary"}
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-dark-500">
                                Book Summary
                            </FormLabel>

                            <FormControl>
                                <Textarea
                                    placeholder="Book Summary"
                                    {...field}
                                    rows={5}
                                    className="book-form_input"
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit button. */}
                <Button type="submit" className="book-form_btn text-white">
                    Add Book to Library
                </Button>
            </form>
        </Form>
    );
};

export default BookForm;