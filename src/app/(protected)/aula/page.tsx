"use client";

import { useContext, useEffect } from "react";
import Aula from "./components/Aula";
import { LoaderContext } from "@/contexts/LoaderContext";
import Notas from "./components/Notas";

export default function Page() {

    const { setResponses } = useContext(LoaderContext);

    useEffect(() => {
        setResponses([false]);
    }, [setResponses]);

    return (
        <main style={{ minHeight: "75vh" }}>
            <section className="container container-ajuste mt-5 pt-5">
                <Aula />
            </section>
            <section className="container container-ajuste my-5">
                <Notas />
            </section>
        </main>
    )
}