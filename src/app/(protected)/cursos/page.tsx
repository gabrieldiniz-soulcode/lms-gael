"use client";

import { Suspense, useContext, useEffect } from "react";

import CategoriasCursos from "./components/CategoriasCursos";
import { LoaderContext } from "@/contexts/LoaderContext";
import Ranking from "../carreiras/components/Ranking";
import Bootcamps from "../carreiras/components/Bootcamps";
import Hero from "../carreiras/components/Hero";

export default function Cursos() {

    const { setResponses } = useContext(LoaderContext);

    useEffect(() => {
        setResponses([false, false]);
    }, [setResponses]);

    return (
        <main className="py-5">
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
                    <CategoriasCursos />
                </Suspense>
            </section>
        </main>
    );
}