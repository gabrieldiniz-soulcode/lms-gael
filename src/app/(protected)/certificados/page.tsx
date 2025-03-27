"use client";

import { useContext, useEffect } from "react";

import Certificados from "./components/Certificados";
import { LoaderContext } from "@/contexts/LoaderContext";

export default function Page() {

    const { setResponses, updateResponses } = useContext(LoaderContext);

    useEffect(() => {
        setResponses([false]);
        updateResponses();
    }, [setResponses, updateResponses]);

    return (
        <main>
            <section className="container container-ajuste mt-5 pt-5">
                <Certificados />
            </section>
        </main>
    )
}