import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Col, Row } from "react-bootstrap";

export default function Faq() {
    return (
        <Row className="d-flex justify-content-center py-5 px-2">
            <Col xxl={8} md={19}>
                <span>Faq</span>
                <h2 className="fw-700 fs-28 mb-4 mt-2">Dúvidas Frequentes</h2>

                <Accordion alwaysOpen>
                    <AccordionItem eventKey="0" className="mb-2">
                        <AccordionHeader>Para quem é o Programa?</AccordionHeader>
                        <AccordionBody>
                            O programa é destinado a jovens e adultos entre 18 e 34 anos, fãs da Kings League, que desejam se
                            desenvolver como criadores de conteúdo ou jogos e atuar profissionalmente no ecossistema de
                            entretenimento digital, explorando novas possibilidades de carreira nesse mercado.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="1" className="mb-2">
                        <AccordionHeader>Qual é a duração do Programa?</AccordionHeader>
                        <AccordionBody>
                            A formação tem duração total de 25 horas de conteúdo, com uma jornada focada em aprendizado prático e desenvolvimento de habilidades aplicáveis ao mercado. A plataforma ficará disponível até o dia 18 de março de 2026.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="2" className="mb-2">
                        <AccordionHeader>Qual é a data de início e encerramento das inscrições?</AccordionHeader>
                        <AccordionBody>
                            As inscrições terão início no dia 04 de fevereiro de 2026 e se encerram às 23h59 do dia 18 de março de 2026 ou até as vagas serem preenchidas.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="3" className="mb-2">
                        <AccordionHeader>O curso oferece certificação?</AccordionHeader>
                        <AccordionBody>
                            Sim. O programa é composto por 11 trilhas de aprendizado, e cada uma delas conta com certificação individual. Ao concluir todas as trilhas, o participante recebe a certificação oficial do Trident Creators Games.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="4" className="mb-2">
                        <AccordionHeader>Como funcionará a etapa de seleção após a formação acadêmica?</AccordionHeader>
                        <AccordionBody>
                            Ao final da parte educacional, até três participantes poderão ser contratados para trabalharem como criadores de conteúdo da marca na Kings League no segundo semestre de 2026, durante a segunda temporada da competição e com tudo custeado. A etapa de seleção será realizada com base em critérios definidos pela equipe Trident, que avaliará o desempenho, o engajamento e o potencial dos participantes ao longo do programa.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="5" className="mb-2">
                        <AccordionHeader>Como posso tirar minhas dúvidas sobre o programa?</AccordionHeader>
                        <AccordionBody>
                            Todas as dúvidas podem ser esclarecidas pelo e-mail atendimento@soulcode.com ou pelo WhatsApp (11) 97314-0687.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="6" className="mb-2">
                        <AccordionHeader>Preciso ter conhecimento prévio para me inscrever?</AccordionHeader>
                        <AccordionBody>
                            Não é necessário possuir conhecimento técnico prévio. No entanto, o programa é indicado para pessoas que já tenham familiaridade com o ambiente digital.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="7" className="mb-2">
                        <AccordionHeader>Como posso me inscrever?</AccordionHeader>
                        <AccordionBody>
                            Para se inscrever, basta preencher o formulário acima.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="8" className="mb-2">
                        <AccordionHeader>O programa é gratuito?</AccordionHeader>
                        <AccordionBody>
                            Sim, as trilhas educacionais são 100% gratuitas para todos os participantes.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="9" className="mb-2">
                        <AccordionHeader>As aulas serão online ou presenciais?</AccordionHeader>
                        <AccordionBody>
                            O programa será realizado no formato online, permitindo que participantes de diferentes regiões possam acompanhar a formação.
                        </AccordionBody>
                    </AccordionItem>
                </Accordion>
            </Col>
        </Row>
    );
}