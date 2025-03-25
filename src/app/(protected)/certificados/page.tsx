"use client";

import { useContext, useEffect } from "react";

import { LoaderContext } from "@/contexts/LoaderContext";

export default function Page() {

    const { setResponses, updateResponses } = useContext(LoaderContext);

    useEffect(() => {
        setResponses([false]);
        updateResponses();
    }, [setResponses]);

    return (
        <main>
            <section className="container container-ajuste mt-5 pt-5">
            </section>
        </main>
    )
}