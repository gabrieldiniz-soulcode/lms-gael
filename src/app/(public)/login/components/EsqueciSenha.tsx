import { api } from "@/shared/api/api";
import { Button, Form } from "react-bootstrap";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useContext, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { useSearchParams } from "next/navigation";

interface Props {
    setEsqueciSenha: (newEsqueciSenha: boolean) => void;
}

export default function EsqueciSenha({ setEsqueciSenha }: Props) {

    const [email, setEmail] = useState<string>("");
    const [senha, setSenha] = useState<string>("");
    const [confirmarSenha, setConfirmarSenha] = useState<string>("");
    const [passwordVisible, setPasswordVisible] = useState<boolean[]>([false, false, false]);
    const [error, setError] = useState("");
    const [mensagem, setMensagem] = useState("");

    const { signInByRecoveryPassword } = useContext(AuthContext);

    const searchParams = useSearchParams();

    const token = searchParams.get('token');

    const togglePasswordVisible = (index: number) => {
        setPasswordVisible((prevData) => (
            prevData.map((data, idx) => {
                if (index == idx) {
                    return !data;
                }
                return data;
            })
        ));
    }

    const iconEye = (index: number) => {
        return (
            passwordVisible[index]
                ?
                <FaRegEyeSlash className="form-password-icon-login" onClick={() => togglePasswordVisible(index)} />
                :
                <FaRegEye className="form-password-icon-login" onClick={() => togglePasswordVisible(index)} />
        )
    }

    const validatePassword = (): boolean | undefined => {
        setError("");
        const hasMinLength = senha.length >= 8;
        const hasNumber = /\d/.test(senha);
        const hasUppercase = /[A-Z]/.test(senha);
        const hasLowercase = /[a-z]/.test(senha);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

        if (senha !== confirmarSenha) {
            setError("As senhas devem ser iguais");
            return;
        }

        if (!hasMinLength) {
            setError("No mínimo ter 8 caracteres");
            return;
        }

        if (!hasNumber) {
            setError("No mínimo ter 1 número");
            return;
        }

        if (!hasUppercase) {
            setError("No mínimo ter 1 letra maiúscula");
            return;
        }

        if (!hasLowercase) {
            setError("No mínimo ter 1 letra minúscula");
            return;
        }

        if (!hasSpecialChar) {
            setError("No mínimo ter 1 caractere especial");
            return;
        }

        return true;
    }

    const handleForgotPassword = () => {
        if (!validatePassword()) return;

        api.post("/user/recoverpassword", {
            token,
            database: process.env.NEXT_PUBLIC_DATABASE,
            new_password: senha
        })
            .then((res) => {
                console.log(res)
                signInByRecoveryPassword({
                    id: res.data.data.userid,
                    token: res.data.token,
                    name: res.data.data.username,
                    database: res.data.data.database
                })
            })
            .catch((err) => {
                setError(err.response.data.error);
            });
    }

    const handleRecoveryPassword = () => {
        api.post("/v2/user/forgotpassword", {
            username: email,
            database: process.env.NEXT_PUBLIC_DATABASE,
            plataform: `gael`
        })
            .then((res) => {
                setMensagem(res.data.message);
            })
            .catch((err) => {
                setMensagem(err.response.data.error);
            })
    }

    return (
        token
            ?
            <>
                <Form.Group controlId="firstname">
                    <div className="position-relative">
                        <Form.Control
                            type={passwordVisible[0] ? 'text' : 'password'}
                            name="senha_atual"
                            className="form-input-login"
                            value={senha}
                            placeholder="Nova senha"
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        {iconEye(0)}
                    </div>
                </Form.Group>
                <Form.Group controlId="firstname">
                    <div className="position-relative">
                        <Form.Control
                            type={passwordVisible[1] ? 'text' : 'password'}
                            name="nova_senha"
                            className="form-input-login"
                            placeholder="Confirmar nova senha"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                        />
                        {iconEye(1)}
                    </div>
                </Form.Group>
                <div className="text-end w-100 text-danger fs-12">{error}</div>
                <Button className="fs-15 mt-auto" onClick={handleForgotPassword}>Alterar senha</Button>
                <Button className="btn-secondary fs-15" onClick={() => setEsqueciSenha(false)}>Voltar ao login</Button>
                <span className="text-center fs-14">Precisa de ajuda? <a href="">Fale Conosco</a></span>
            </>
            :
            <>
                <Form.Control className="form-input-login" type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} />
                <div className="text-end w-100 fs-12">{mensagem}</div>
                <Button className="fs-15 mt-auto" onClick={handleRecoveryPassword}>Enviar e-mail</Button>
                <Button className="btn-secondary fs-15" onClick={() => setEsqueciSenha(false)}>Voltar ao login</Button>
                <span className="text-center fs-14">Precisa de ajuda? <a href="">Fale Conosco</a></span>
            </>
    );
}