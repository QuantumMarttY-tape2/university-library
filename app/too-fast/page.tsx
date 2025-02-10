import React from "react";

const Page = () => {
    return (
        <main className="root-container flex min-h-screem flex-col items-center justify-center">
            <h1 className="font-bebas-neue text-5xl font-bold text-light-100">
                This the internet traffic police. You have been detained for being too fast.
            </h1>
            <p className="mt-3 max-w-xl text-center text-light-400">
                While you are here, we have some music just for you.
                <span className="text-blue-100">
                    <a href="https://www.youtube.com/watch?v=Lofu_PBIrbg" className="">
                        Give it a try.
                    </a>
                </span>
            </p>
        </main>
    )
}

export default Page;