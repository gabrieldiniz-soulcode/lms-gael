"use client";

import { useContext, useEffect } from "react";

import AlterarSenha from "./components/AlterarSenha";
import { LoaderContext } from "@/contexts/LoaderContext";

type PasswordValidationResult = {
    hasMinLength: boolean;
    hasNumber: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasSpecialChar: boolean;
    strengthLevel: "Fraca" | "Média" | "Forte";
  };

export default function Page() {

    const { setResponses, updateResponses } = useContext(LoaderContext);

    useEffect(() => {
        setResponses([false]);
        updateResponses();
    }, [setResponses]);

    return (
        <main>
            <section className="container container-ajuste my-5 pt-5">
                <AlterarSenha />
            </section>
        </main>
    );
}