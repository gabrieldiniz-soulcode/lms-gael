"use client";

import { useContext, useEffect } from "react";
import Categorias from "./components/Categorias";
import { LoaderContext } from "@/contexts/LoaderContext";
import Hero from "./components/Hero";

export default function Carreiras() {

    const { setResponses } = useContext(LoaderContext);

    useEffect(() => {
        setResponses([false, false]);
    }, [setResponses]);

    return (
        <main className="py-5" >
            <section className="container container-ajuste mt-5 pt-5">
                <Hero />
            </section>
            <section className="container container-ajuste mt-5 pe-xxl-0">
                <Categorias />
            </section>
        </main>
    )
}