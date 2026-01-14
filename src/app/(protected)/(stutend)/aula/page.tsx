"use client";

import { Suspense, useContext, useEffect } from "react";

import Aula from "./components/Aula";
import { LoaderContext } from "@/contexts/LoaderContext";

export default function Page() {

    const { setResponses } = useContext(LoaderContext);

    useEffect(() => {
        setResponses([false]);
    }, [setResponses]);

    return (
        <main style={{ minHeight: "75vh" }}>
            <section className="container container-ajuste mt-5 pt-5">
                <Suspense>
                    <Aula />
                </Suspense>
            </section>
        </main>
    )
}