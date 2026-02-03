import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Col, Row } from "react-bootstrap";

export default function Faq() {

    return (
        <Row className="d-flex justify-content-center py-5 px-2">
            <Col xxl={8} md={19}>
                <span>Faq</span>
                <h2 className="fw-700 fs-28 mb-4 mt-2">Dúvidas Frequentes</h2>

                <Accordion alwaysOpen>
                    <AccordionItem eventKey="0" className="mb-2">
                        <AccordionHeader>Vou receber certificado de cada carreira finalizada? </AccordionHeader>
                        <AccordionBody>
                            Recebe sim! Tanto os certificados de cada curso, quanto os certificados de cada carreira.
                        </AccordionBody>
                    </AccordionItem>
                    <AccordionItem eventKey="1" className="mb-2">
                        <AccordionHeader>Estou com dificuldades para acessar a plataforma. O que fazer?</AccordionHeader>
                        <AccordionBody>Entre em contato no chat, Whatsapp ou e-mail atendimento@soulcode.com e informe qual plataforma você está tentando acessar: Starter, Passaporte Digital ou Processo Seletivo, descrevendo o erro que aparece. 
                            Se possível, envie uma captura de tela para facilitar o entendimento do problema. Também é importante compartilhar o e-mail usado no cadastro para verificarmos possíveis problemas no login. Com essas informações poderemos 
                            orientar sobre os próximos passos.
                        </AccordionBody>
                    </AccordionItem>
                    <AccordionItem eventKey="2" className="mb-2">
                        <AccordionHeader>Qual a duração do programa? </AccordionHeader>
                        <AccordionBody>
                            A formação tem duração total de 25 horas de conteúdo, com uma jornada focada em aprendizado prático e desenvolvimento de habilidades aplicáveis ao mercado. A plataforma ficará disponível até o dia 18 de março de 2026.
                        </AccordionBody>
                    </AccordionItem>
                    <AccordionItem eventKey="3" className="mb-2">
                        <AccordionHeader>As aulas serão online ou presenciais? </AccordionHeader>
                        <AccordionBody>
                            O programa será realizado no formato online, permitindo que participantes de diferentes regiões possam acompanhar a formação.
                        </AccordionBody>
                    </AccordionItem>
                </Accordion>
            </Col>
        </Row>
    )
}