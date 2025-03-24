"use client";

import { useContext, useEffect } from "react";

import Formulario from "./components/Formulario";
import { LoaderContext } from "@/contexts/LoaderContext";

export default function Page() {

    const { setResponses } = useContext(LoaderContext);

    useEffect(() => {
        setResponses([false]);
    }, [setResponses]);

    return (
        <main>
            <section className="container container-ajuste mt-5 pt-5">
                {/* <Formulario /> */}
            </section>
        </main>
    );
}