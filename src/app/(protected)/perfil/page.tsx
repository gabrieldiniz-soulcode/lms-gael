"use client";

import { LoaderContext } from "@/contexts/LoaderContext";
import { useContext, useEffect } from "react";
import Perfil from "./components/Perfil";
import Carreiras from "./components/Carreiras";
import Certificados from "./components/Certificados";

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