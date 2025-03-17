"use client";

import { LoaderContext } from "@/contexts/LoaderContext";
import { useContext, useEffect } from "react";

export default function Page() {

    const { setResponses, updateResponses } = useContext(LoaderContext);

    useEffect(() => {
        setResponses([false]);
        updateResponses();
    }, [setResponses, updateResponses]);

    return (
        <main>
            <section className="container container-ajuste mt-5 pt-5">
            </section>
        </main>
    )
}