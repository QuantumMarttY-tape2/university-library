"use client";

import React, { useRef, useState } from "react";
import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
import config from "@/lib/config";
import Image from "next/image";

import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils";


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

interface Props {
    type: "image" | "video";
    accept: string;
    placeholder: string;
    folder: string;
    variant: "dark" | "light";
    onFileChange: (filePath: string) => void;
    value?: string;
}

const FileUpload = ({ type, accept, placeholder, folder, variant, value, onFileChange }: Props ) => {
    const ikUploadRef = useRef(null);
    // Track file when uploading.
    const [file, setFile] = useState<{ filePath: string | null }>({
        filePath: value ?? null,
      });
    // Upload progress.
    const [progress, setProgress] = useState(0);

    // Styles.
    const styles = {
        button: variant === "dark" ? "bg-dark-300" : "bg-light-600 border-gray-100 border",
        placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
        text: variant === "dark" ? "text-light-100" : "text-dark-400",
    }

    // Functions that trigger during upload.
    const onError = (error: any) => {
        console.log(error);
        // Also gives a shadcn toast message when fails.
        toast({
            title: `${type} upload failed.`,
            description: `Your ${type} could not be uploaded. Please try again.`,
            variant: "destructive",
        });
    };
    const onSuccess = (res: any) => {
        setFile(res);

        // Set file path.
        onFileChange(res.filePath);

        // Toast message.
        toast({
            title: `${type} uploaded successfully.`,
            description: `${res.filePath} uploaded successfully.`,
        });
    };

    // Provide validation for the files we are uploading.
    const onValidate = (file: File) => {
        if (type === "image") {
            if (file.size > 20 * 1024 * 1024) {
                toast({
                    title: "File size too large",
                    description: "Please upload a file less than 20MB in disk size.",
                    variant: "destructive",
                });

                // We are not going to upload files too big.
                return false;
            }
        }
        else if (type === "video") {
            if (file.size > 50 * 1024 * 1024) {
                toast({
                    title: "File size too large",
                    description: "Please upload a file less than 50MB in disk size.",
                    variant: "destructive",
                });

                // We are not going to upload files too big.
                return false;
            }
        }

        // The validation is good otherwise.
        return true;
    }

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
                useUniqueFileName={true}
                validateFile={onValidate}
                onUploadStart={() => setProgress(0)}
                onUploadProgress={({ loaded, total }) => {
                    const percent = Math.floor((loaded / total) * 100);

                    setProgress(percent);
                }}
                folder={folder}
                accept={accept}
            />
            
            {/* Submit button. */}
            <button
                className={cn("upload-btn", styles.button)}
                onClick={(e) => {
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

                <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>

                {/* Check if a file has been uploaded. */}
                {file && (
                    <p className={cn("upload-filename", styles.text)}>{file.filePath}</p>
                )}
            </button>

            {/* Progress bar. */}
            {progress > 0 && progress !== 100 && (
                <div className="w-full rounded-full bg-green-200">
                    <div className="progress" style={{ width: `${progress}%` }}>
                        {progress}%
                    </div>
                </div>
            )}

            {/* Render a preview after upload. */}
            {file && (
                // If it is an image:
                (type === "image" ? (
                    <IKImage
                        alt={file.filePath!}
                        path={file.filePath!}
                        width={500}
                        height={500}
                    />
                ) : (type === "video") ? (
                    // If it is a video:
                    <IKVideo
                        path={file.filePath!}
                        controls={true}
                        className="h-96 w-full rounded-xl"
                    />
                ) : null)
            )}
        </ImageKitProvider>
    );
};

export default FileUpload;