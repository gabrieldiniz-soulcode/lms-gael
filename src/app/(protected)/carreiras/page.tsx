"use client";

import { useContext, useEffect } from "react";
import Categorias from "./components/Categorias";
import { LoaderContext } from "@/contexts/LoaderContext";

export default function Carreiras() {

    const { setResponses } = useContext(LoaderContext);

    useEffect(() => {
        setResponses([false]);
    }, [setResponses]);

    return (
        <main className="py-5" >
            <section className="container container-ajuste mt-5">
                <Categorias />
            </section>
        </main>
    )
}