"use client";

import { LoaderContext } from "@/contexts/LoaderContext";
import { Suspense, useContext, useEffect } from "react";
import Chat from "./components/Chat";


export default function Page() {

    const { updateResponses } = useContext(LoaderContext);

    useEffect(() => {
        updateResponses();
    }, [updateResponses]);

    return (
        <main>
            <section className="container container-ajuste mt-5 pt-5">
                <Suspense>
                    <Chat />
                </Suspense>
            </section>
        </main>
    )
}