"use client";

import { useContext, useEffect } from "react";

import Certificados from "./components/Certificados";
import { LoaderContext } from "@/contexts/LoaderContext";

export default function Page() {

    const { setResponses } = useContext(LoaderContext);

    useEffect(() => {
        setResponses([false]);
    }, [setResponses]);

    return (
        <main>
            <section className="container container-ajuste mt-5 pt-5 min-vh-85">
                <Certificados />
            </section>
        </main>
    )
}