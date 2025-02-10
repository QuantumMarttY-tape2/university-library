"use client";

import React, { useRef, useState } from "react";
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import config from "@/lib/config";
import Image from "next/image";

import { toast } from "@/hooks/use-toast"


// config setup.
const { env:{ imagekit: { publicKey, urlEndpoint } } } = config;

// Function that authenticate the user to securly upload images.
const authenticator = async () => {
    try {
        const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

        if (!response.ok) {
            const errorText = await response.text();

            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        const { signature, expire, token } = data;

        return { signature, expire, token };
    } catch (error: any) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
}

const ImageUpload = ({ onFileChange }: { onFileChange: (filePath: string) => void}) => {
    const ikUploadRef = useRef(null);
    // Track file when uploading.
    const [file, setFile] = useState<{ filePath: string } | null>(null);

    // Functions that trigger during upload.
    const onError = (error: any) => {
        console.log(error);
        // Also gives a shadcn toast message when fails.
        toast({
            title: "Image upload failed.",
            description: "Your image could not be uploaded. Please try again.",
            variant: "destructive",
        });
    };
    const onSuccess = (res: any) => {
        setFile(res);

        // Set file path.
        onFileChange(res.filePath);

        // Toast message.
        toast({
            title: "Image uploaded successfully.",
            description: `${res.filePath} uploaded successfully.`,
        });
    };

    return (
        <ImageKitProvider
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            authenticator={authenticator}
        >
            {/* Upload area. */}
            <IKUpload
                className="hidden"
                ref={ikUploadRef}
                onError={onError}
                onSuccess={onSuccess}
                fileName="test-upload.png"
            />
            
            {/* Submit button. */}
            <button className="upload-btn" onClick={(e) => {
                e.preventDefault();

                // If ikUploadRef exists:
                if (ikUploadRef.current) {
                    // We can ignore this error right now.
                    // @ts-ignore
                    ikUploadRef.current?.click();
                }
            }}>
                <Image
                    src="/icons/upload.svg"
                    alt="upload-icon"
                    width={20}
                    height={20}
                    className="object-contain"
                />

                <p className="text-base text-light-100">Upload a File</p>

                {/* Render file path if the file exists. */}
                {file && <p className="upload-filename">{file.filePath}</p>}
            </button>

            {/* Render an image after upload. */}
            {file && (
                <IKImage
                    alt={file.filePath}
                    path={file.filePath}
                    width={500}
                    height={500}
                />
            )}
        </ImageKitProvider>
    );
};

export default ImageUpload;