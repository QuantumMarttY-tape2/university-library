import config from "@/lib/config";
import Imagekit from "imagekit";
import { NextResponse } from "next/server";

const { env:{ imagekit: { publicKey, urlEndpoint, privateKey } } } = config;

const imagekit = new Imagekit({ publicKey, privateKey, urlEndpoint });

export async function GET() {
    return NextResponse.json(imagekit.getAuthenticationParameters());
}
