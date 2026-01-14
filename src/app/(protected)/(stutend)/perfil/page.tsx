"use client";

import { useContext, useEffect } from "react";

import Carreiras from "./components/Carreiras";
import Certificados from "./components/Certificados";
import { LoaderContext } from "@/contexts/LoaderContext";
import Perfil from "./components/Perfil";

export default function Page() {

    const { setResponses } = useContext(LoaderContext);

    useEffect(() => {
        setResponses([false, false]);
    }, [setResponses]);

    return (
        <main>
            <section className="container container-ajuste mt-5 pt-5">
                <Perfil />
            </section>
            <section className="container container-ajuste mt-5 pt-2">
                <Carreiras />
            </section>
            <section className="container container-ajuste my-5 pt-2">
                <Certificados />
            </section>
        </main>
    )
}