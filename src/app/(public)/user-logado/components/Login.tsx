'use client';

import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { Spinner } from "react-bootstrap";
import { useSearchParams } from "next/navigation";

export default function LoginWithEmail() {
    const [logado, setLogado] = useState(false);
    const { signIn } = useContext(AuthContext);

    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    useEffect(() => {
        if (logado) return;

        if (email) {
            setLogado(true);
            signIn(email, "Mudar@123", true);
        }
    }, [email, logado, signIn]);

    return (
        <div className="d-flex justify-content-center align-items-center h-100">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
}
