"use client";

import { Suspense, useContext, useEffect } from "react";

import Curso from "./components/Curso";
import { LoaderContext } from "@/contexts/LoaderContext";

export default function Page() {

    const { setResponses } = useContext(LoaderContext);

    useEffect(() => {
        setResponses([false, false]);
    }, [setResponses]);

    return (
        <main>
            <section className="container container-ajuste mt-5 pt-5">
                <Suspense>
                    <Curso />
                </Suspense>
            </section>
        </main>
    )
}