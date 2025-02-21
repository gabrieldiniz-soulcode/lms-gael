'use client';

import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";

export default function FormLogin() {

    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const { signIn, user } = useContext(AuthContext);

    useEffect(() => {
        console.log(user)
    }, [user])

    const togglePasswordVisible = () => {
        setPasswordVisible(!passwordVisible);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        signIn(email, password, rememberMe);
    }

    function validate(): boolean {
        if (!email || !password) return true;
        return false;
    }


    return (
        <Row className="container-login d-flex align-items-center justify-content-center row-gap-5">
            <Col xl={4} md={8} className="p-0">
                <h1 className="fs-38 fw-700 text-auxiliary7-project">Bem- vindo(a)</h1>
                <span className="fs-21 text-white">
                    Para acessar nossos cursos, você deverá realizar login. Caso não tenha acesso, visite o site da <a href="https://soulcode.com/assinatura-cursos-online" className="text-white" target="_blank">SoulCode</a> para realizar sua assinatura.</span>
            </Col>
            <Col className="bg-white offset-xl-3 d-flex flex-column gap-3 p-4 rounded-3" xxl={4} xl={5} md={8}>
                <Form.Control className="form-input-login" type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} />
                <div className="position-relative">
                    <Form.Control className="form-input-login" type={passwordVisible ? 'text' : 'password'} placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />
                    {
                        passwordVisible
                            ?
                            <FaRegEyeSlash className="form-password-icon-login" onClick={togglePasswordVisible} />
                            :
                            <FaRegEye className="form-password-icon-login" onClick={togglePasswordVisible} />
                    }
                </div>
                <div className="d-flex justify-content-between flex-wrap">
                    <Form.Check
                        className="fw-300 text-auxiliary2-project cursor-pointer fs-15"
                        type="checkbox"
                        id="remember-me"
                        label="Manter logado"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="fw-300 text-auxiliary2-project cursor-pointer fs-15">Esqueci a senha</span>
                </div>
                <Button className="fs-15" disabled={validate()} onClick={e => handleSubmit(e)}>Acessar</Button>
                <Button className="btn-secondary fs-15">Faça sua assinatura</Button>
                <span className="text-center fs-14">Precisa de ajuda? <a href="">Fale Cosnosco</a></span>
            </Col>
        </Row>
    )
}