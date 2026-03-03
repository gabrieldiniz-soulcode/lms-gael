import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Col, Row } from "react-bootstrap";

export default function Faq() {
    return (
        <Row className="d-flex justify-content-center py-5 px-2">
            <Col xxl={8} md={19}>
                <span>Faq</span>
                <h2 className="fw-700 fs-28 mb-4 mt-2">Dúvidas Frequentes</h2>

                <Accordion alwaysOpen>
                    <AccordionItem eventKey="0" className="mb-2">
                        <AccordionHeader>Pra quem é o Programa?</AccordionHeader>
                        <AccordionBody>
                            O programa é destinado para entregadores e entregadoras do iFood de todo Brasil que desejam aprender a criar e publicar jogos.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="1" className="mb-2">
                        <AccordionHeader>Qual a duração do programa?</AccordionHeader>
                        <AccordionBody>
                            A formação tem duração total de 11 horas de conteúdo.
                            A plataforma ficará disponível até o dia  31 de maio de 2026 .
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="2" className="mb-2">
                        <AccordionHeader>Qual a data de início e encerramento das inscrições?</AccordionHeader>
                        <AccordionBody>
                            As inscrições terão início no dia 01 de março de 2026 e se encerram às 23h59 do dia 31 de maio de 2026 ou até as vagas serem preenchidas.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="3" className="mb-2">
                        <AccordionHeader>O curso oferece certificação?</AccordionHeader>
                        <AccordionBody>
                            Sim. O programa é composto por 6 trilhas de aprendizado, e cada uma delas conta com certificação individual. Ao concluir todas as trilhas, o participante recebe a certificação oficial do CorrePlay.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="4" className="mb-2">
                        <AccordionHeader>Como posso tirar minhas dúvidas sobre o programa?</AccordionHeader>
                        <AccordionBody>
                            Todas as dúvidas podem ser esclarecidas pelo e-mail atendimento@soulcode.com ou pelo WhatsApp (11) 97314-0687.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="5" className="mb-2">
                        <AccordionHeader>Preciso ter conhecimento prévio para me inscrever?</AccordionHeader>
                        <AccordionBody>
                            Não é necessário possuir conhecimento técnico prévio para participar do CorrePlay.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="6" className="mb-2">
                        <AccordionHeader>Como posso me inscrever?</AccordionHeader>
                        <AccordionBody>
                            Para se inscrever, basta preencher o formulário na página <a href="https://correplay.soulcode.com/" target="_blank">oficial do programa</a>.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="7" className="mb-2">
                        <AccordionHeader>O programa é gratuito?</AccordionHeader>
                        <AccordionBody>
                            Sim, as trilhas educacionais são 100% gratuitas para todos os participantes.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="8" className="mb-2">
                        <AccordionHeader>As aulas serão online ou presenciais?</AccordionHeader>
                        <AccordionBody>
                            O programa será realizado no formato online, permitindo que participantes de diferentes regiões possam acompanhar a formação direto pelo celular ou computador.
                        </AccordionBody>
                    </AccordionItem>
                </Accordion>
            </Col>
        </Row>
    );
}
