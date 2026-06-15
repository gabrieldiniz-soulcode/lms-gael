'use client';

import { Button, Col, Form, Row } from "react-bootstrap";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Suspense, useContext, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import EsqueciSenha from "./EsqueciSenha";
import Image from "next/image";
import logo1 from "/public/gael/logo.png";

export default function FormLogin({ forgotPassword = false }: { forgotPassword?: boolean }) {

    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [esqueciSenha, setEsqueciSenha] = useState<boolean>(forgotPassword);
    const [error, setError] = useState<string>();

    const { signIn } = useContext(AuthContext);

    const togglePasswordVisible = () => {
        setPasswordVisible(!passwordVisible);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn(email, password, rememberMe);
        if (res === "not_enrolled") {
            setError("Você não está inscrito no programa");
        } else if (res === "invalid_credentials") {
            setError("Credenciais inválidas");
        }
    }

    const openZendesk = () => {
        if (window.zE) {
            window.zE("messenger", "open");
        }
    };

    function validate(): boolean {
        if (!email || !password) return true;
        return false;
    }

    return (
        <Row className="container-login d-flex align-items-center justify-content-center row-gap-5">
            <Col xl={4} md={8} className="p-0 d-flex flex-column gap-3">
                <Image src={logo1.src} width={300} height={150} alt="logo Gael" className="object-fit-contain" style={{ maxWidth: '300px', height: 'auto' }} />
                <h1 className="fs-38 fw-700 text-primary">Bem-vindo(a)</h1>
                <span className="fs-21 text-white mb-3">
                    Para acessar nossos cursos, você deverá realizar login. Caso não tenha acesso, visite o <a href="https://criamais.soulcode.com/" target="_blank" rel="noopener noreferrer" className="text-white">site do programa</a> para realizar sua inscrição.
                </span>
            </Col>
            <Col className="bg-white offset-xl-3 d-flex flex-column gap-3 p-4 rounded-3" xxl={4} xl={5} md={8} style={{ minHeight: 324 }}>
                {
                    esqueciSenha
                        ?
                        <Suspense>
                            <EsqueciSenha setEsqueciSenha={setEsqueciSenha} />
                        </Suspense>
                        :
                        <>
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
                            <div className="text-end w-100 text-danger fs-12">{error}</div>

                            <div className="d-flex justify-content-between flex-wrap">
                                <Form.Check
                                    className="fw-300 text-auxiliary2-project cursor-pointer fs-15"
                                    type="checkbox"
                                    id="remember-me"
                                    label="Manter logado"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className="fw-300 text-auxiliary2-project cursor-pointer fs-15" onClick={() => setEsqueciSenha(true)}>Esqueci a senha</span>
                            </div>

                            <Button className="fs-15" disabled={validate()} onClick={e => handleSubmit(e)}>Acessar</Button>
                            <Button variant="secondary" className="fs-15 border-1 border-black" href="https://criamais.soulcode.com/" target="_blank">Faça sua assinatura</Button>
                            <span className="text-center fs-14">Precisa de ajuda? <a className="cursor-pointer" onClick={() => openZendesk()}>Fale Conosco</a></span>
                        </>
                }
            </Col>
        </Row>
    )
}
