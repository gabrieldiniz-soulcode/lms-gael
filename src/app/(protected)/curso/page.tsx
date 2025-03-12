"use client";

import { LoaderContext } from "@/contexts/LoaderContext";
import { useContext, useEffect } from "react";
import Curso from "./components/Curso";

export default function Page() {

    const { setResponses } = useContext(LoaderContext);

    useEffect(() => {
        setResponses([false, false]);
    }, [setResponses]);

    return (
        <main>
            <section className="container container-ajuste mt-5 pt-5">
                <Curso />
            </section>
        </main>
    )
}