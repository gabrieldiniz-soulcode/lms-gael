import LoginWithEmail from "./components/Login";
import { Suspense } from "react";

export default function UsuarioLogado() {

    return (
        <Suspense>
            <LoginWithEmail></LoginWithEmail>
        </Suspense>
    );
}