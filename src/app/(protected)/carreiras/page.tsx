"use client";

import { Suspense, useContext, useEffect } from "react";

import Bootcamps from "./components/Bootcamps";
import Categorias from "./components/Categorias";
import Hero from "./components/Hero";
import { LoaderContext } from "@/contexts/LoaderContext";
import Ranking from "./components/Ranking";

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
            <section className="container container-ajuste mt-5 d-xl-none d-block">
                <Ranking />
            </section>
            <section className="container container-ajuste mt-5">
                <Bootcamps />
            </section>
            <section className="container container-ajuste mt-5 pe-xxl-0">
                <Suspense>
                    <Categorias />
                </Suspense>
            </section>
        </main>
    )
}