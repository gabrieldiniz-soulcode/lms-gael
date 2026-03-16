'use client';

import { Button, Col, Form, Row } from "react-bootstrap";

import { useState } from "react";

export default function ValidarCertificado() {

    const [code, setCode] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [response, setReponse] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setReponse('');
        setError('');
        axios
            .get("/verify_certificate", {
                headers: {
                    database: process.env.NEXT_PUBLIC_DATABASE,
                    certificate: code
                }
            })
            .then((res) => {
                const data = res.data.custom_cert;
                setReponse(`Nome: ${data.firstname} ${data.lastname}\nCurso: ${data.coursename} ${data.workload}H\nCódigo: ${data.code}`)
            })
            .catch(() => {
                setError("Erro ao validar certificado");
            })
    }

    return (
        <Row className="container-login d-flex align-items-center justify-content-center row-gap-5">
            <Col xl={4} md={8} className="p-0">
                <h1 className="fs-38 fw-700 text-auxiliary7-project">Bem- vindo(a)</h1>
                <span className="fs-21 text-white">
                    Para acessar nossos cursos, você deverá realizar login. Caso não tenha acesso, visite o site da <a href="https://soulcode.com/assinatura-cursos-online" className="text-white" target="_blank">SoulCode</a> para realizar sua assinatura.</span>
            </Col>
            <Col className="bg-white offset-xl-3 d-flex flex-column gap-3 p-4 rounded-3" xxl={4} xl={5} md={8} style={{ minHeight: 324 }}>

                <Form.Control className="form-input-login" type="email" placeholder="Código" onChange={(e) => setCode(e.target.value)} />
                <div className="text-end w-100 text-danger fs-12">{error}</div>
                <pre>{response}</pre>
                <Button className="fs-15 mt-auto" onClick={e => handleSubmit(e)}>Validar Código</Button>
                <Button className="btn-secondary fs-15">Ir para Login</Button>
                <span className="text-center fs-14">Precisa de ajuda? <a href="">Fale Conosco</a></span>
            </Col>
        </Row>
    )
}