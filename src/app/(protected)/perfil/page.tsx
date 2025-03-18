"use client";

import { LoaderContext } from "@/contexts/LoaderContext";
import { useContext, useEffect } from "react";
import Perfil from "./components/Perfil";

export default function Page() {

    const { setResponses } = useContext(LoaderContext);

    useEffect(() => {
        setResponses([false]);
    }, [setResponses]);

    return (
        <main>
            <section className="container container-ajuste mt-5 pt-5">
                <Perfil />
            </section>
        </main>
    )
}